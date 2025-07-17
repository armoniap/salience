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
  }

  processEntities(apiResponse) {
    const { entities, language } = apiResponse;
    
    if (!entities || entities.length === 0) {
      return {
        entities: [],
        language,
        totalEntities: 0,
        entityTypes: {},
        maxSalience: 0,
        minSalience: 0
      };
    }

    const processedEntities = entities.map(entity => this.processEntity(entity));
    const sortedEntities = processedEntities.sort((a, b) => b.salience - a.salience);

    const entityTypes = this.groupEntitiesByType(sortedEntities);
    const maxSalience = Math.max(...sortedEntities.map(e => e.salience));
    const minSalience = Math.min(...sortedEntities.map(e => e.salience));

    return {
      entities: sortedEntities,
      language,
      totalEntities: sortedEntities.length,
      entityTypes,
      maxSalience,
      minSalience
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
}

// Export for use in other modules
window.EntityAnalyzer = EntityAnalyzer;