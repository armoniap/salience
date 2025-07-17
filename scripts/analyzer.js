// Text Analysis and Entity Processing

class EntityAnalyzer {
  constructor() {
    this.entityTypes = {
      PERSON: 'Person',
      LOCATION: 'Location',
      ORGANIZATION: 'Organization',
      EVENT: 'Event',
      WORK_OF_ART: 'Work of Art',
      CONSUMER_GOOD: 'Consumer Good',
      OTHER: 'Other',
      UNKNOWN: 'Unknown'
    };

    this.entityColors = {
      PERSON: '#1976d2',
      LOCATION: '#388e3c',
      ORGANIZATION: '#f57c00',
      EVENT: '#7b1fa2',
      WORK_OF_ART: '#c2185b',
      CONSUMER_GOOD: '#5d4037',
      OTHER: '#666666',
      UNKNOWN: '#999999'
    };

    // Stopwords for different languages
    this.stopwords = {
      it: new Set([
        // Articles
        'il', 'lo', 'la', 'i', 'gli', 'le', 'un', 'uno', 'una', 'dei', 'degli', 'delle',
        // Prepositions
        'di', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra', 'del', 'dello', 'della',
        'dall', 'dalla', 'dal', 'dallo', 'nel', 'nello', 'nella', 'nei', 'negli', 'nelle',
        'col', 'coi', 'sul', 'sullo', 'sulla', 'sui', 'sugli', 'sulle',
        // Conjunctions
        'e', 'o', 'ma', 'però', 'quindi', 'perciò', 'infatti', 'inoltre', 'anche', 'pure',
        'sia', 'oppure', 'ovvero', 'cioè', 'ossia', 'mentre', 'quando', 'se', 'come',
        // Pronouns
        'io', 'tu', 'egli', 'ella', 'esso', 'essa', 'noi', 'voi', 'essi', 'esse', 'lui', 'lei',
        'mi', 'ti', 'ci', 'vi', 'si', 'me', 'te', 'lui', 'lei', 'noi', 'voi', 'loro',
        'mio', 'tuo', 'suo', 'nostro', 'vostro', 'mia', 'tua', 'sua', 'nostra', 'vostra',
        'questo', 'questa', 'quello', 'quella', 'questi', 'queste', 'quelli', 'quelle',
        'che', 'chi', 'cui', 'quale', 'quali', 'quanto', 'quanta', 'quanti', 'quante',
        // Adverbs
        'non', 'più', 'molto', 'poco', 'tanto', 'quanto', 'troppo', 'abbastanza', 'piuttosto',
        'ancora', 'già', 'sempre', 'mai', 'spesso', 'subito', 'presto', 'tardi', 'prima',
        'dopo', 'poi', 'qui', 'qua', 'là', 'lì', 'dove', 'dovunque', 'ovunque', 'altrove',
        'sopra', 'sotto', 'dentro', 'fuori', 'davanti', 'dietro', 'accanto', 'insieme',
        'così', 'bene', 'male', 'meglio', 'peggio', 'forse', 'certamente', 'sicuramente',
        // Verbs (common forms)
        'è', 'sono', 'sei', 'siamo', 'siete', 'era', 'erano', 'ero', 'eri', 'eravamo', 'eravate',
        'sarà', 'saranno', 'sarò', 'sarai', 'saremo', 'sarete', 'sia', 'siano', 'fossi', 'fosse',
        'ha', 'ho', 'hai', 'abbiamo', 'avete', 'hanno', 'aveva', 'avevo', 'avevi', 'avevamo',
        'avevate', 'avevano', 'avrà', 'avrò', 'avrai', 'avremo', 'avrete', 'avranno',
        'fa', 'fai', 'facciamo', 'fate', 'fanno', 'faceva', 'facevo', 'facevi', 'facevamo',
        'va', 'vai', 'andiamo', 'andate', 'vanno', 'andava', 'andavo', 'andavi', 'andavamo',
        'dice', 'dico', 'dici', 'diciamo', 'dite', 'dicono', 'diceva', 'dicevo', 'dicevi',
        'viene', 'vengo', 'vieni', 'veniamo', 'venite', 'vengono', 'veniva', 'venivo',
        'può', 'posso', 'puoi', 'possiamo', 'potete', 'possono', 'poteva', 'potevo',
        'deve', 'devo', 'devi', 'dobbiamo', 'dovete', 'devono', 'doveva', 'dovevo',
        'vuole', 'voglio', 'vuoi', 'vogliamo', 'volete', 'vogliono', 'voleva', 'volevo',
        // Other common words
        'cosa', 'cose', 'modo', 'tempo', 'volta', 'volte', 'anno', 'anni', 'giorno', 'giorni',
        'parte', 'parti', 'caso', 'casi', 'fatto', 'fatti', 'vita', 'mondo', 'paese', 'stati',
        'stato', 'grande', 'nuovo', 'primo', 'ultimo', 'altro', 'altri', 'altre', 'tutto',
        'tutti', 'tutte', 'ogni', 'qualche', 'niente', 'nulla', 'qualcosa', 'qualcuno',
        'nessuno', 'ognuno', 'ciascuno', 'stesso', 'stessa', 'stessi', 'stesse'
      ]),
      en: new Set([
        // Articles
        'a', 'an', 'the',
        // Prepositions
        'in', 'on', 'at', 'by', 'to', 'for', 'of', 'with', 'from', 'up', 'about', 'into',
        'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among',
        // Conjunctions
        'and', 'or', 'but', 'so', 'yet', 'nor', 'for', 'because', 'since', 'as', 'if',
        'when', 'where', 'while', 'although', 'though', 'unless', 'until', 'whereas',
        // Pronouns
        'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
        'my', 'your', 'his', 'her', 'its', 'our', 'their', 'this', 'that', 'these', 'those',
        'who', 'whom', 'whose', 'which', 'what', 'where', 'when', 'why', 'how',
        // Adverbs
        'not', 'very', 'too', 'so', 'just', 'now', 'then', 'here', 'there', 'where',
        'how', 'when', 'why', 'what', 'well', 'also', 'only', 'first', 'last', 'next',
        'new', 'old', 'good', 'bad', 'big', 'small', 'long', 'short', 'high', 'low',
        // Verbs (common forms)
        'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having',
        'do', 'does', 'did', 'doing', 'will', 'would', 'could', 'should', 'may', 'might',
        'must', 'can', 'get', 'got', 'go', 'goes', 'went', 'going', 'come', 'came', 'coming',
        'see', 'saw', 'seen', 'look', 'looking', 'know', 'knew', 'known', 'think', 'thought',
        'take', 'took', 'taken', 'give', 'gave', 'given', 'make', 'made', 'making',
        // Other common words
        'all', 'any', 'some', 'no', 'one', 'two', 'first', 'other', 'many', 'most',
        'more', 'much', 'way', 'time', 'day', 'year', 'work', 'life', 'world', 'people',
        'man', 'woman', 'child', 'part', 'place', 'thing', 'right', 'left', 'same',
        'different', 'each', 'every', 'such', 'own', 'over', 'under', 'again', 'still'
      ]),
      es: new Set([
        // Articles
        'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
        // Prepositions
        'de', 'en', 'a', 'por', 'para', 'con', 'sin', 'sobre', 'bajo', 'entre', 'desde',
        'hasta', 'durante', 'mediante', 'según', 'contra', 'hacia', 'ante', 'tras',
        // Conjunctions
        'y', 'o', 'pero', 'sino', 'aunque', 'porque', 'que', 'si', 'como', 'cuando',
        'donde', 'mientras', 'pues', 'así', 'también', 'tampoco', 'ni', 'sea', 'bien',
        // Pronouns
        'yo', 'tú', 'él', 'ella', 'nosotros', 'vosotros', 'ellos', 'ellas', 'me', 'te',
        'se', 'nos', 'os', 'le', 'la', 'lo', 'les', 'las', 'los', 'mi', 'tu', 'su',
        'nuestro', 'vuestro', 'este', 'esta', 'esto', 'estos', 'estas', 'ese', 'esa',
        'eso', 'esos', 'esas', 'aquel', 'aquella', 'aquello', 'aquellos', 'aquellas',
        'quien', 'cual', 'cuales', 'cuanto', 'cuanta', 'cuantos', 'cuantas',
        // Common verbs
        'es', 'son', 'era', 'eran', 'fue', 'fueron', 'sea', 'sean', 'ser', 'estar',
        'está', 'están', 'estaba', 'estaban', 'estuvo', 'estuvieron', 'esté', 'estén',
        'ha', 'han', 'había', 'habían', 'hubo', 'hubieron', 'haya', 'hayan', 'haber',
        'hace', 'hacen', 'hacía', 'hacían', 'hizo', 'hicieron', 'haga', 'hagan', 'hacer',
        'va', 'van', 'iba', 'iban', 'fue', 'fueron', 'vaya', 'vayan', 'ir',
        'dice', 'dicen', 'decía', 'decían', 'dijo', 'dijeron', 'diga', 'digan', 'decir',
        'viene', 'vienen', 'venía', 'venían', 'vino', 'vinieron', 'venga', 'vengan', 'venir',
        'puede', 'pueden', 'podía', 'podían', 'pudo', 'pudieron', 'pueda', 'puedan', 'poder',
        'debe', 'deben', 'debía', 'debían', 'debió', 'debieron', 'deba', 'deban', 'deber',
        'quiere', 'quieren', 'quería', 'querían', 'quiso', 'quisieron', 'quiera', 'quieran',
        // Other common words
        'todo', 'toda', 'todos', 'todas', 'otro', 'otra', 'otros', 'otras', 'mismo',
        'misma', 'mismos', 'mismas', 'muy', 'más', 'menos', 'tanto', 'tan', 'mucho',
        'poco', 'algo', 'nada', 'todo', 'cada', 'alguno', 'ninguno', 'cualquier',
        'bastante', 'demasiado', 'siempre', 'nunca', 'ya', 'aún', 'todavía', 'aquí',
        'ahí', 'allí', 'donde', 'cuando', 'como', 'así', 'bien', 'mal', 'mejor', 'peor'
      ]),
      fr: new Set([
        // Articles
        'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'des',
        // Prepositions
        'de', 'à', 'dans', 'par', 'pour', 'avec', 'sans', 'sur', 'sous', 'entre',
        'vers', 'chez', 'depuis', 'pendant', 'avant', 'après', 'contre', 'selon',
        // Conjunctions
        'et', 'ou', 'mais', 'car', 'or', 'ni', 'donc', 'que', 'si', 'comme',
        'quand', 'où', 'tandis', 'bien', 'ainsi', 'aussi', 'encore', 'cependant',
        // Pronouns
        'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'me', 'te',
        'se', 'nous', 'vous', 'le', 'la', 'les', 'lui', 'leur', 'mon', 'ton',
        'son', 'notre', 'votre', 'leur', 'ce', 'cette', 'ces', 'celui', 'celle',
        'ceux', 'celles', 'qui', 'que', 'dont', 'où', 'quoi', 'lequel', 'laquelle',
        // Common verbs
        'est', 'sont', 'était', 'étaient', 'été', 'être', 'ai', 'as', 'a', 'avons',
        'avez', 'ont', 'avait', 'avaient', 'eu', 'avoir', 'fait', 'font', 'faisait',
        'faisaient', 'faire', 'va', 'vont', 'allait', 'allaient', 'allé', 'aller',
        'dit', 'disent', 'disait', 'disaient', 'dire', 'vient', 'viennent', 'venait',
        'venaient', 'venu', 'venir', 'peut', 'peuvent', 'pouvait', 'pouvaient', 'pu',
        'pouvoir', 'doit', 'doivent', 'devait', 'devaient', 'dû', 'devoir', 'veut',
        'veulent', 'voulait', 'voulaient', 'voulu', 'vouloir', 'sait', 'savent',
        'savait', 'savaient', 'su', 'savoir', 'prend', 'prennent', 'prenait', 'prenaient',
        // Other common words
        'tout', 'toute', 'tous', 'toutes', 'autre', 'autres', 'même', 'mêmes',
        'très', 'plus', 'moins', 'tant', 'beaucoup', 'peu', 'assez', 'trop',
        'quelque', 'quelques', 'chaque', 'aucun', 'aucune', 'certains', 'certaines',
        'plusieurs', 'toujours', 'jamais', 'déjà', 'encore', 'ici', 'là', 'où',
        'quand', 'comment', 'pourquoi', 'bien', 'mal', 'mieux', 'pire'
      ]),
      de: new Set([
        // Articles
        'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'einem', 'einer', 'eines',
        // Prepositions
        'in', 'zu', 'von', 'mit', 'bei', 'nach', 'aus', 'auf', 'für', 'an', 'um', 'über',
        'unter', 'durch', 'gegen', 'ohne', 'während', 'wegen', 'seit', 'bis', 'vor', 'hinter',
        // Conjunctions
        'und', 'oder', 'aber', 'denn', 'doch', 'jedoch', 'sondern', 'dass', 'ob', 'wenn',
        'als', 'wie', 'weil', 'da', 'obwohl', 'während', 'bevor', 'nachdem', 'damit', 'so',
        // Pronouns
        'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'mich', 'dich', 'sich', 'uns',
        'euch', 'ihm', 'ihr', 'ihnen', 'mein', 'dein', 'sein', 'ihr', 'unser', 'euer',
        'dieser', 'diese', 'dieses', 'jener', 'jene', 'jenes', 'welcher', 'welche', 'welches',
        'wer', 'was', 'wo', 'wann', 'warum', 'wie', 'wieviel', 'welch',
        // Common verbs
        'ist', 'sind', 'war', 'waren', 'bin', 'bist', 'sein', 'hat', 'haben', 'hatte',
        'hatten', 'habe', 'hast', 'wird', 'werden', 'wurde', 'wurden', 'werde', 'wirst',
        'kann', 'können', 'konnte', 'konnten', 'muss', 'müssen', 'musste', 'mussten',
        'will', 'wollen', 'wollte', 'wollten', 'soll', 'sollen', 'sollte', 'sollten',
        'macht', 'machen', 'machte', 'machten', 'geht', 'gehen', 'ging', 'gingen',
        'kommt', 'kommen', 'kam', 'kamen', 'sagt', 'sagen', 'sagte', 'sagten',
        'gibt', 'geben', 'gab', 'gaben', 'nimmt', 'nehmen', 'nahm', 'nahmen',
        // Other common words
        'alle', 'alles', 'andere', 'anderen', 'anderer', 'anderes', 'viele', 'viel',
        'wenig', 'wenige', 'mehr', 'weniger', 'sehr', 'zu', 'auch', 'nur', 'noch',
        'schon', 'immer', 'nie', 'niemals', 'hier', 'da', 'dort', 'wo', 'wohin',
        'woher', 'wann', 'heute', 'gestern', 'morgen', 'jetzt', 'dann', 'nun',
        'gut', 'schlecht', 'besser', 'schlechter', 'groß', 'klein', 'neu', 'alt'
      ])
    };
  }

  processEntities(apiResponse, options = {}) {
    const { entities, language } = apiResponse;
    const { deduplicate = true, filterStopwords = true } = options;
    
    if (!entities || entities.length === 0) {
      return {
        entities: [],
        language,
        totalEntities: 0,
        entityTypes: {},
        maxSalience: 0,
        minSalience: 0,
        deduplicationApplied: false
      };
    }

    const processedEntities = entities.map(entity => this.processEntity(entity));
    
    // Apply stopword filtering if enabled
    const filteredEntities = filterStopwords ? 
      this.filterStopwords(processedEntities, language) : 
      processedEntities;
    
    // Apply deduplication if enabled
    const finalEntities = deduplicate ? 
      this.deduplicateEntities(filteredEntities) : 
      filteredEntities;
    
    const sortedEntities = finalEntities.sort((a, b) => b.salience - a.salience);

    // Enhance entities with intelligence features
    const enhancedEntities = this.enhanceEntitiesWithIntelligence(sortedEntities, apiResponse.originalText || '');

    const entityTypes = this.groupEntitiesByType(enhancedEntities);
    const maxSalience = Math.max(...enhancedEntities.map(e => e.salience));
    const minSalience = Math.min(...enhancedEntities.map(e => e.salience));

    return {
      entities: enhancedEntities,
      language,
      totalEntities: enhancedEntities.length,
      entityTypes,
      maxSalience,
      minSalience,
      deduplicationApplied: deduplicate,
      stopwordFilteringApplied: filterStopwords,
      originalCount: processedEntities.length,
      filteredCount: filteredEntities.length
    };
  }

  processEntity(entity) {
    const processed = {
      name: entity.name || 'Unknown',
      type: entity.type || 'OTHER',
      typeName: this.entityTypes[entity.type] || 'Other',
      salience: entity.salience || 0,
      mentions: entity.mentions || [],
      metadata: entity.metadata || {},
      color: this.entityColors[entity.type] || '#666666'
    };

    // Process mentions
    processed.mentions = processed.mentions.map(mention => ({
      text: mention.text?.content || '',
      type: mention.type || 'COMMON',
      beginOffset: mention.text?.beginOffset || 0
    }));

    // Process metadata
    if (processed.metadata.wikipedia_url) {
      processed.wikipediaUrl = processed.metadata.wikipedia_url;
    }

    // Calculate confidence based on salience and mentions
    processed.confidence = this.calculateConfidence(processed);

    return processed;
  }

  enhanceEntitiesWithIntelligence(entities, originalText) {
    return entities.map(entity => {
      const enhanced = { ...entity };
      
      // Add salience classification
      enhanced.salienceClassification = this.classifySalience(entity.salience, entities);
      
      // Add factor analysis
      enhanced.salienceFactors = this.analyzeSalienceFactors(entity, originalText);
      
      // Add optimization suggestions
      enhanced.optimizationSuggestions = this.generateOptimizationSuggestions(entity, originalText);
      
      // Add practical score (0-100)
      enhanced.practicalScore = this.calculatePracticalScore(entity, entities);
      
      return enhanced;
    });
  }

  classifySalience(salience, allEntities) {
    // Calculate percentiles within the text
    const sortedSaliences = allEntities.map(e => e.salience).sort((a, b) => b - a);
    const percentile = (sortedSaliences.indexOf(salience) / sortedSaliences.length) * 100;
    
    // Define classification based on both absolute values and relative position
    if (salience >= 0.15 || percentile <= 5) {
      return {
        category: 'dominant',
        label: 'Dominante',
        icon: '🔥',
        description: 'Entità centrale del testo',
        color: '#e53e3e',
        score: 100
      };
    } else if (salience >= 0.08 || percentile <= 15) {
      return {
        category: 'prominent',
        label: 'Prominente', 
        icon: '⭐',
        description: 'Entità molto importante',
        color: '#dd6b20',
        score: 85
      };
    } else if (salience >= 0.04 || percentile <= 35) {
      return {
        category: 'relevant',
        label: 'Rilevante',
        icon: '📈',
        description: 'Entità significativa',
        color: '#38a169',
        score: 65
      };
    } else if (salience >= 0.02 || percentile <= 60) {
      return {
        category: 'present',
        label: 'Presente',
        icon: '📊',
        description: 'Entità menzionata',
        color: '#3182ce',
        score: 45
      };
    } else {
      return {
        category: 'marginal',
        label: 'Marginale',
        icon: '👻',
        description: 'Entità poco rilevante',
        color: '#718096',
        score: 20
      };
    }
  }

  analyzeSalienceFactors(entity, originalText) {
    const factors = {
      frequency: this.analyzeFrequency(entity),
      position: this.analyzePosition(entity, originalText),
      context: this.analyzeContext(entity, originalText),
      mentionTypes: this.analyzeMentionTypes(entity),
      cooccurrence: this.analyzeCooccurrence(entity, originalText)
    };
    
    return factors;
  }

  analyzeFrequency(entity) {
    const mentionCount = entity.mentions.length;
    let rating, description;
    
    if (mentionCount >= 8) {
      rating = 'high';
      description = `Ottima frequenza (${mentionCount} mentions)`;
    } else if (mentionCount >= 4) {
      rating = 'medium';
      description = `Buona frequenza (${mentionCount} mentions)`;
    } else if (mentionCount >= 2) {
      rating = 'low';
      description = `Frequenza bassa (${mentionCount} mentions)`;
    } else {
      rating = 'very_low';
      description = `Frequenza molto bassa (${mentionCount} mention)`;
    }
    
    return {
      count: mentionCount,
      rating,
      description,
      score: Math.min(mentionCount * 10, 100)
    };
  }

  analyzePosition(entity, originalText) {
    const textLength = originalText.length;
    let positionScores = [];
    let inTitle = false;
    let inFirstParagraph = false;
    
    entity.mentions.forEach(mention => {
      const position = mention.beginOffset;
      const relativePosition = position / textLength;
      
      // Check if in title (first 100 characters)
      if (position < 100) {
        inTitle = true;
        positionScores.push(100);
      }
      // Check if in first paragraph (first 20% of text)
      else if (relativePosition < 0.2) {
        inFirstParagraph = true;
        positionScores.push(80);
      }
      // Early in text
      else if (relativePosition < 0.5) {
        positionScores.push(60);
      }
      // Later in text
      else {
        positionScores.push(30);
      }
    });
    
    const avgScore = positionScores.reduce((a, b) => a + b, 0) / positionScores.length;
    
    let description = [];
    if (inTitle) description.push('Nel titolo/inizio');
    if (inFirstParagraph) description.push('Nel primo paragrafo');
    if (description.length === 0) description.push('Distribuito nel testo');
    
    return {
      inTitle,
      inFirstParagraph,
      averageScore: avgScore,
      description: description.join(', '),
      positions: entity.mentions.map(m => ({
        offset: m.beginOffset,
        relative: m.beginOffset / textLength,
        text: m.text
      }))
    };
  }

  analyzeContext(entity, originalText) {
    // Analyze the context around each mention
    const contexts = entity.mentions.map(mention => {
      const start = Math.max(0, mention.beginOffset - 50);
      const end = Math.min(originalText.length, mention.beginOffset + mention.text.length + 50);
      const context = originalText.substring(start, end);
      
      return {
        text: context,
        beforeText: originalText.substring(start, mention.beginOffset),
        afterText: originalText.substring(mention.beginOffset + mention.text.length, end)
      };
    });
    
    return {
      contexts,
      uniqueContexts: contexts.length,
      description: `Appare in ${contexts.length} contesti diversi`
    };
  }

  analyzeMentionTypes(entity) {
    const properCount = entity.mentions.filter(m => m.type === 'PROPER').length;
    const commonCount = entity.mentions.filter(m => m.type === 'COMMON').length;
    const total = entity.mentions.length;
    
    const properRatio = properCount / total;
    
    let quality, description;
    if (properRatio >= 0.7) {
      quality = 'high';
      description = `Prevalentemente nome proprio (${properCount}/${total})`;
    } else if (properRatio >= 0.3) {
      quality = 'medium';
      description = `Mix nome proprio/comune (${properCount}/${total})`;
    } else {
      quality = 'low';
      description = `Prevalentemente nome comune (${properCount}/${total})`;
    }
    
    return {
      proper: properCount,
      common: commonCount,
      properRatio,
      quality,
      description
    };
  }

  analyzeCooccurrence(entity, originalText) {
    // Simplified co-occurrence analysis
    // In a full implementation, this would analyze which other entities appear near this one
    return {
      description: 'Analisi co-occorrenza disponibile',
      nearbyEntities: [] // Placeholder for future implementation
    };
  }

  generateOptimizationSuggestions(entity, originalText) {
    const suggestions = [];
    const factors = this.analyzeSalienceFactors(entity, originalText);
    const classification = this.classifySalience(entity.salience, [entity]);
    
    // Frequency suggestions
    if (factors.frequency.rating === 'very_low' || factors.frequency.rating === 'low') {
      suggestions.push({
        type: 'frequency',
        priority: 'high',
        icon: '🔄',
        title: 'Aumenta la frequenza',
        description: `Menziona "${entity.name}" più spesso nel testo per aumentarne l'importanza`,
        actionable: `Target: 4-6 mentions invece di ${factors.frequency.count}`
      });
    }
    
    // Position suggestions
    if (!factors.position.inTitle && classification.category !== 'dominant') {
      suggestions.push({
        type: 'position',
        priority: 'high',
        icon: '📍',
        title: 'Migliora il posizionamento',
        description: `Inserisci "${entity.name}" nel titolo o nei primi 100 caratteri`,
        actionable: 'Le entità menzionate all\'inizio hanno maggiore salienza'
      });
    }
    
    if (!factors.position.inFirstParagraph) {
      suggestions.push({
        type: 'position',
        priority: 'medium',
        icon: '📝',
        title: 'Rafforza l\'introduzione',
        description: `Menziona "${entity.name}" nel primo paragrafo`,
        actionable: 'Il posizionamento precoce aumenta la salienza'
      });
    }
    
    // Mention type suggestions
    if (factors.mentionTypes.quality === 'low') {
      suggestions.push({
        type: 'mention_type',
        priority: 'medium',
        icon: '🔤',
        title: 'Usa come nome proprio',
        description: `Scrivi "${entity.name}" con le maiuscole quando possibile`,
        actionable: 'I nomi propri hanno maggiore peso nell\'analisi'
      });
    }
    
    // Context suggestions
    if (classification.category === 'marginal' || classification.category === 'present') {
      suggestions.push({
        type: 'context',
        priority: 'medium',
        icon: '🎯',
        title: 'Raggruppa contenuti correlati',
        description: `Crea sezioni dedicate a "${entity.name}"`,
        actionable: 'Raggruppa informazioni correlate per aumentare il focus'
      });
    }
    
    // Wikipedia/Authority suggestions
    if (!entity.wikipediaUrl && classification.category !== 'marginal') {
      suggestions.push({
        type: 'authority',
        priority: 'low',
        icon: '🔗',
        title: 'Aggiungi autorevolezza',
        description: `"${entity.name}" potrebbe beneficiare di link esterni autorevoli`,
        actionable: 'I link a fonti autorevoli aumentano la credibilità'
      });
    }
    
    // Positive feedback for good entities
    if (classification.category === 'dominant' || classification.category === 'prominent') {
      suggestions.push({
        type: 'positive',
        priority: 'info',
        icon: '✅',
        title: 'Ottima performance',
        description: `"${entity.name}" ha un'eccellente salienza nel testo`,
        actionable: 'Mantieni questa strategia per altre entità importanti'
      });
    }
    
    return suggestions;
  }

  calculatePracticalScore(entity, allEntities) {
    const classification = this.classifySalience(entity.salience, allEntities);
    return classification.score;
  }

  calculateConfidence(entity) {
    let confidence = entity.salience;
    
    // Boost confidence based on number of mentions
    const mentionBoost = Math.min(entity.mentions.length * 0.1, 0.3);
    confidence += mentionBoost;

    // Boost confidence if Wikipedia URL is available
    if (entity.wikipediaUrl) {
      confidence += 0.1;
    }

    // Boost confidence for proper nouns
    const properMentions = entity.mentions.filter(m => m.type === 'PROPER').length;
    if (properMentions > 0) {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }

  groupEntitiesByType(entities) {
    const grouped = {};
    entities.forEach(entity => {
      const type = entity.type;
      if (!grouped[type]) {
        grouped[type] = {
          count: 0,
          entities: [],
          averageSalience: 0
        };
      }
      grouped[type].count++;
      grouped[type].entities.push(entity);
    });

    // Calculate average salience for each type
    Object.keys(grouped).forEach(type => {
      const typeData = grouped[type];
      typeData.averageSalience = typeData.entities.reduce((sum, entity) => sum + entity.salience, 0) / typeData.count;
    });

    return grouped;
  }

  highlightEntitiesInText(text, entities) {
    if (!text || !entities || entities.length === 0) {
      return text;
    }

    // Create a list of all mentions with their positions
    const mentions = [];
    entities.forEach(entity => {
      entity.mentions.forEach(mention => {
        mentions.push({
          text: mention.text,
          beginOffset: mention.beginOffset,
          endOffset: mention.beginOffset + mention.text.length,
          entityType: entity.type,
          entityName: entity.name,
          salience: entity.salience
        });
      });
    });

    // Sort mentions by position (reverse order to avoid offset issues)
    mentions.sort((a, b) => b.beginOffset - a.beginOffset);

    // Apply highlighting
    let highlightedText = text;
    mentions.forEach(mention => {
      const before = highlightedText.substring(0, mention.beginOffset);
      const highlighted = highlightedText.substring(mention.beginOffset, mention.endOffset);
      const after = highlightedText.substring(mention.endOffset);

      const entityClass = mention.entityType.toLowerCase();
      const highlightedSpan = `<span class="highlighted-entity ${entityClass}" 
        data-entity="${mention.entityName}" 
        data-type="${mention.entityType}" 
        data-salience="${mention.salience.toFixed(3)}" 
        title="${mention.entityName} (${this.entityTypes[mention.entityType]}, Salience: ${mention.salience.toFixed(3)})">${highlighted}</span>`;

      highlightedText = before + highlightedSpan + after;
    });

    return highlightedText;
  }

  exportToJSON(analysisResult) {
    return JSON.stringify(analysisResult, null, 2);
  }

  exportToCSV(analysisResult) {
    const { entities } = analysisResult;
    if (!entities || entities.length === 0) {
      return 'No entities found';
    }

    const headers = ['Name', 'Type', 'Salience', 'Mentions Count', 'Wikipedia URL', 'Confidence'];
    const csvRows = [headers.join(',')];

    entities.forEach(entity => {
      const row = [
        this.escapeCsvValue(entity.name),
        this.escapeCsvValue(entity.typeName),
        entity.salience.toFixed(4),
        entity.mentions.length,
        this.escapeCsvValue(entity.wikipediaUrl || ''),
        entity.confidence.toFixed(4)
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  escapeCsvValue(value) {
    if (typeof value !== 'string') {
      return value;
    }
    
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    
    return value;
  }

  getAnalysisStats(analysisResult) {
    const { entities, entityTypes } = analysisResult;
    
    if (!entities || entities.length === 0) {
      return {
        totalEntities: 0,
        topEntityTypes: [],
        averageSalience: 0,
        highSalienceEntities: 0
      };
    }

    const totalSalience = entities.reduce((sum, entity) => sum + entity.salience, 0);
    const averageSalience = totalSalience / entities.length;
    const highSalienceEntities = entities.filter(entity => entity.salience > 0.5).length;

    const topEntityTypes = Object.entries(entityTypes)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 5)
      .map(([type, data]) => ({
        type,
        name: this.entityTypes[type],
        count: data.count,
        averageSalience: data.averageSalience
      }));

    return {
      totalEntities: entities.length,
      topEntityTypes,
      averageSalience,
      highSalienceEntities
    };
  }

  validateAnalysisResult(result) {
    if (!result || typeof result !== 'object') {
      throw new Error('Invalid analysis result');
    }

    if (!Array.isArray(result.entities)) {
      throw new Error('Invalid entities data');
    }

    return true;
  }

  // Stopword Filtering Methods
  filterStopwords(entities, language) {
    const stopwordSet = this.getStopwordsForLanguage(language);
    if (!stopwordSet || stopwordSet.size === 0) {
      return entities; // No filtering if no stopwords available
    }

    return entities.filter(entity => {
      return !this.isStopwordEntity(entity, stopwordSet);
    });
  }

  getStopwordsForLanguage(language) {
    // Map language codes to stopword sets
    const languageMap = {
      'it': 'it',
      'en': 'en', 
      'es': 'es',
      'fr': 'fr',
      'de': 'de',
      'italian': 'it',
      'english': 'en',
      'spanish': 'es',
      'french': 'fr',
      'german': 'de'
    };

    const normalizedLang = language ? language.toLowerCase() : 'en';
    const stopwordLang = languageMap[normalizedLang] || 'en';
    
    return this.stopwords[stopwordLang] || this.stopwords['en'];
  }

  isStopwordEntity(entity, stopwordSet) {
    // Check if entity name (normalized) is a stopword
    const normalizedName = entity.name.toLowerCase().trim();
    
    // Direct stopword check
    if (stopwordSet.has(normalizedName)) {
      return true;
    }

    // Check if all mentions are stopwords
    const allMentionsAreStopwords = entity.mentions.every(mention => {
      const normalizedMention = mention.text.toLowerCase().trim();
      return stopwordSet.has(normalizedMention);
    });

    if (allMentionsAreStopwords) {
      return true;
    }

    // Additional filters for very common, non-meaningful entities
    if (this.isNonMeaningfulEntity(entity)) {
      return true;
    }

    return false;
  }

  isNonMeaningfulEntity(entity) {
    const name = entity.name.toLowerCase().trim();
    
    // Filter out single characters (unless they're meaningful abbreviations)
    if (name.length === 1 && !/[a-z]/.test(name)) {
      return true;
    }

    // Filter out common punctuation that might be detected as entities
    if (/^[.,;:!?()[\]{}'"]+$/.test(name)) {
      return true;
    }

    // Filter out numbers unless they're significant (dates, years, etc.)
    if (/^\d+$/.test(name) && name.length < 4) {
      return true;
    }

    // Filter out very short entities with low salience (likely noise)
    if (name.length <= 2 && entity.salience < 0.1) {
      return true;
    }

    // Filter out entities that are just whitespace or special characters
    if (/^\s*$/.test(name) || /^[^\w\s]*$/.test(name)) {
      return true;
    }

    // Filter out very generic terms that are not meaningful
    const genericTerms = ['cosa', 'cose', 'modo', 'tipo', 'tipi', 'parte', 'parti', 
                         'volta', 'volte', 'fatto', 'fatti', 'idea', 'idee', 'senso',
                         'thing', 'things', 'way', 'ways', 'part', 'parts', 'time', 'times',
                         'idea', 'ideas', 'sense', 'point', 'points', 'kind', 'kinds'];
    
    if (genericTerms.includes(name)) {
      return true;
    }

    return false;
  }

  // Entity Deduplication Methods
  deduplicateEntities(entities) {
    // First pass: exact normalized matches
    const exactGroups = new Map();
    entities.forEach(entity => {
      const normalizedName = this.normalizeEntityName(entity.name);
      const key = `${normalizedName}|${entity.type}`;
      
      if (!exactGroups.has(key)) {
        exactGroups.set(key, []);
      }
      exactGroups.get(key).push(entity);
    });
    
    // Consolidate exact matches
    const exactlyDeduplicated = [];
    exactGroups.forEach((group, key) => {
      if (group.length === 1) {
        exactlyDeduplicated.push(group[0]);
      } else {
        const consolidated = this.consolidateEntityGroup(group);
        exactlyDeduplicated.push(consolidated);
      }
    });
    
    // Second pass: similarity and containment matching
    const finalDeduplication = this.applySimilarityDeduplication(exactlyDeduplicated);
    
    return finalDeduplication;
  }

  applySimilarityDeduplication(entities) {
    const result = [];
    const processed = new Set();
    
    entities.forEach((entity, index) => {
      if (processed.has(index)) return;
      
      // Find similar entities
      const similarEntities = [entity];
      const similarIndices = [index];
      
      for (let i = index + 1; i < entities.length; i++) {
        if (processed.has(i)) continue;
        
        const otherEntity = entities[i];
        if (this.areEntitiesSimilar(entity, otherEntity)) {
          similarEntities.push(otherEntity);
          similarIndices.push(i);
        }
      }
      
      // Mark all similar entities as processed
      similarIndices.forEach(idx => processed.add(idx));
      
      // Consolidate similar entities
      if (similarEntities.length === 1) {
        result.push(entity);
      } else {
        const consolidated = this.consolidateEntityGroup(similarEntities);
        result.push(consolidated);
      }
    });
    
    return result;
  }

  areEntitiesSimilar(entity1, entity2) {
    // Must be same type
    if (entity1.type !== entity2.type) {
      return false;
    }
    
    const name1 = entity1.name.toLowerCase();
    const name2 = entity2.name.toLowerCase();
    
    // Check for containment (coach vs life coach)
    if (name1.includes(name2) || name2.includes(name1)) {
      return true;
    }
    
    // Check for word overlap (significant overlap indicates similarity)
    const words1 = new Set(name1.split(/\s+/));
    const words2 = new Set(name2.split(/\s+/));
    
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);
    
    // Jaccard similarity threshold
    const similarity = intersection.size / union.size;
    
    // Consider similar if >50% word overlap
    if (similarity > 0.5) {
      return true;
    }
    
    // Check for stemmed similarity
    const stemmed1 = this.applyStemming(name1);
    const stemmed2 = this.applyStemming(name2);
    
    if (stemmed1 === stemmed2) {
      return true;
    }
    
    // Check for common entity patterns
    if (this.hasCommonEntityPattern(name1, name2)) {
      return true;
    }
    
    return false;
  }

  hasCommonEntityPattern(name1, name2) {
    // Common patterns that indicate same entity
    const patterns = [
      // Professional titles
      { base: /\b(coach|coaching)\b/, variants: ['coach', 'coaching', 'life coach', 'life coaching'] },
      { base: /\b(consulente|consulenza)\b/, variants: ['consulente', 'consulenza'] },
      { base: /\b(manager|management)\b/, variants: ['manager', 'management'] },
      { base: /\b(trainer|training)\b/, variants: ['trainer', 'training'] },
      
      // Business terms
      { base: /\b(azienda|aziendale)\b/, variants: ['azienda', 'aziendale'] },
      { base: /\b(impresa|imprenditore)\b/, variants: ['impresa', 'imprenditore'] },
      { base: /\b(business|businessman)\b/, variants: ['business', 'businessman'] },
      
      // Generic terms
      { base: /\b(persona|persone)\b/, variants: ['persona', 'persone'] },
      { base: /\b(cliente|clienti)\b/, variants: ['cliente', 'clienti'] },
      { base: /\b(servizio|servizi)\b/, variants: ['servizio', 'servizi'] }
    ];
    
    return patterns.some(pattern => {
      const matches1 = pattern.variants.some(variant => name1.includes(variant));
      const matches2 = pattern.variants.some(variant => name2.includes(variant));
      return matches1 && matches2;
    });
  }

  normalizeEntityName(name) {
    if (!name || typeof name !== 'string') {
      return '';
    }
    
    // Convert to lowercase for comparison
    let normalized = name.toLowerCase();
    
    // Remove extra whitespace
    normalized = normalized.trim().replace(/\s+/g, ' ');
    
    // Remove common punctuation for comparison
    normalized = normalized.replace(/[.,;:!?()[\]{}'"]/g, '');
    
    // Handle common variations and abbreviations
    normalized = normalized.replace(/\bdr\b\.?/g, 'doctor');
    normalized = normalized.replace(/\bmr\b\.?/g, 'mister');
    normalized = normalized.replace(/\bmrs\b\.?/g, 'missus');
    normalized = normalized.replace(/\bprof\b\.?/g, 'professor');
    
    // Apply stemming-like transformations for better matching
    normalized = this.applyStemming(normalized);
    
    return normalized;
  }

  applyStemming(text) {
    // Simple stemming rules for Italian and English
    let stemmed = text;
    
    // Italian plural/singular forms
    stemmed = stemmed.replace(/\b(\w+)i\b/g, '$1o'); // libri -> libro
    stemmed = stemmed.replace(/\b(\w+)e\b/g, '$1a'); // persone -> persona (sometimes)
    stemmed = stemmed.replace(/\b(\w+)zioni\b/g, '$1zione'); // informazioni -> informazione
    stemmed = stemmed.replace(/\b(\w+)ioni\b/g, '$1ione'); // opinioni -> opinione
    
    // English plural/singular forms
    stemmed = stemmed.replace(/\b(\w+)s\b/g, '$1'); // coaches -> coach
    stemmed = stemmed.replace(/\b(\w+)es\b/g, '$1'); // businesses -> business
    stemmed = stemmed.replace(/\b(\w+)ies\b/g, '$1y'); // companies -> company
    
    // Common verb forms
    stemmed = stemmed.replace(/\b(\w+)ing\b/g, '$1'); // coaching -> coach
    stemmed = stemmed.replace(/\b(\w+)ed\b/g, '$1'); // coached -> coach
    stemmed = stemmed.replace(/\b(\w+)er\b/g, '$1'); // teacher -> teach
    
    // Italian verb forms
    stemmed = stemmed.replace(/\b(\w+)ando\b/g, '$1are'); // parlando -> parlare
    stemmed = stemmed.replace(/\b(\w+)endo\b/g, '$1ere'); // scrivendo -> scrivere
    
    return stemmed;
  }

  consolidateEntityGroup(entityGroup) {
    if (!entityGroup || entityGroup.length === 0) {
      return null;
    }
    
    if (entityGroup.length === 1) {
      return entityGroup[0];
    }
    
    // Sort by salience to get the most salient entity as base
    const sortedGroup = entityGroup.sort((a, b) => b.salience - a.salience);
    const primaryEntity = sortedGroup[0];
    
    // Choose the best name (prefer proper nouns, longer names, Wikipedia entities)
    const bestName = this.chooseBestEntityName(entityGroup);
    
    // Combine all mentions
    const allMentions = [];
    const mentionTexts = new Set();
    
    entityGroup.forEach(entity => {
      entity.mentions.forEach(mention => {
        // Avoid duplicate mentions
        const mentionKey = `${mention.text}|${mention.beginOffset}`;
        if (!mentionTexts.has(mentionKey)) {
          mentionTexts.add(mentionKey);
          allMentions.push(mention);
        }
      });
    });
    
    // Sort mentions by position in text
    allMentions.sort((a, b) => a.beginOffset - b.beginOffset);
    
    // Combine salience scores (weighted average)
    const combinedSalience = this.combineSalienceScores(entityGroup);
    
    // Choose the best metadata (prefer entities with Wikipedia URLs)
    const bestMetadata = this.chooseBestMetadata(entityGroup);
    
    // Create consolidated entity
    const consolidated = {
      name: bestName,
      type: primaryEntity.type,
      typeName: primaryEntity.typeName,
      salience: combinedSalience,
      mentions: allMentions,
      metadata: bestMetadata,
      color: primaryEntity.color,
      wikipediaUrl: bestMetadata.wikipedia_url || null,
      confidence: this.calculateConfidence({
        salience: combinedSalience,
        mentions: allMentions,
        wikipediaUrl: bestMetadata.wikipedia_url
      }),
      // Add deduplication info
      isDeduplicated: true,
      originalEntities: entityGroup.length,
      originalNames: entityGroup.map(e => e.name)
    };
    
    return consolidated;
  }

  chooseBestEntityName(entityGroup) {
    // Priority order:
    // 1. Entities with Wikipedia URLs
    // 2. More specific names (life coach vs coach)
    // 3. Proper nouns (PROPER mentions)
    // 4. Longer names
    // 5. Higher salience
    
    let bestEntity = entityGroup[0];
    let bestScore = 0;
    
    entityGroup.forEach(entity => {
      let score = 0;
      
      // Wikipedia URL bonus (highest priority)
      if (entity.wikipediaUrl || entity.metadata.wikipedia_url) {
        score += 1000;
      }
      
      // Specificity bonus (prefer "life coach" over "coach")
      score += this.getSpecificityScore(entity.name, entityGroup);
      
      // Proper noun bonus
      const properMentions = entity.mentions.filter(m => m.type === 'PROPER').length;
      score += properMentions * 50;
      
      // Length bonus (more specific names are usually longer)
      score += entity.name.length * 2;
      
      // Salience bonus
      score += entity.salience * 100;
      
      // Frequency bonus (more mentions = more important)
      score += entity.mentions.length * 10;
      
      if (score > bestScore) {
        bestScore = score;
        bestEntity = entity;
      }
    });
    
    return bestEntity.name;
  }

  getSpecificityScore(entityName, entityGroup) {
    const name = entityName.toLowerCase();
    let specificityScore = 0;
    
    // Check how many other entities in the group are contained in this name
    entityGroup.forEach(otherEntity => {
      const otherName = otherEntity.name.toLowerCase();
      if (otherName !== name && name.includes(otherName)) {
        // This entity is more specific (contains others)
        specificityScore += 200;
      }
    });
    
    // Bonus for compound terms (more specific)
    const wordCount = name.split(/\s+/).length;
    specificityScore += wordCount * 20;
    
    // Bonus for professional terms that are typically more specific
    const specificTerms = ['life coach', 'business coach', 'executive coach', 'personal trainer',
                          'project manager', 'product manager', 'marketing manager'];
    
    if (specificTerms.some(term => name.includes(term))) {
      specificityScore += 100;
    }
    
    return specificityScore;
  }

  combineSalienceScores(entityGroup) {
    // Use weighted average based on confidence
    let totalWeightedSalience = 0;
    let totalWeight = 0;
    
    entityGroup.forEach(entity => {
      const weight = entity.confidence || 1;
      totalWeightedSalience += entity.salience * weight;
      totalWeight += weight;
    });
    
    return totalWeight > 0 ? totalWeightedSalience / totalWeight : 0;
  }

  chooseBestMetadata(entityGroup) {
    // Prefer metadata with Wikipedia URLs and more information
    let bestMetadata = {};
    let bestScore = 0;
    
    entityGroup.forEach(entity => {
      const metadata = entity.metadata || {};
      let score = 0;
      
      // Wikipedia URL is very valuable
      if (metadata.wikipedia_url) {
        score += 100;
      }
      
      // MID (Machine ID) is also valuable
      if (metadata.mid) {
        score += 50;
      }
      
      // More metadata fields = better
      score += Object.keys(metadata).length * 5;
      
      if (score > bestScore) {
        bestScore = score;
        bestMetadata = metadata;
      }
    });
    
    return bestMetadata;
  }
}

// Export for use in other modules
window.EntityAnalyzer = EntityAnalyzer;