// UI Interactions and DOM Manipulation

class UIManager {
  constructor() {
    this.elements = {};
    this.state = {
      isAnalyzing: false,
      lastAnalysis: null,
      currentText: ''
    };
    this.bindElements();
    this.bindEvents();
  }

  bindElements() {
    this.elements = {
      textInput: document.getElementById('text-input'),
      characterCount: document.querySelector('.character-count'),
      languageSelect: document.getElementById('language-select'),
      analyzeBtn: document.getElementById('analyze-btn'),
      clearBtn: document.getElementById('clear-btn'),
      retryBtn: document.getElementById('retry-btn'),
      
      loadingSection: document.getElementById('loading-section'),
      errorSection: document.getElementById('error-section'),
      resultsSection: document.getElementById('results-section'),
      
      detectedLanguage: document.getElementById('detected-language'),
      entityCount: document.getElementById('entity-count'),
      entitiesList: document.getElementById('entities-list'),
      highlightedContent: document.getElementById('highlighted-content'),
      
      exportJsonBtn: document.getElementById('export-json'),
      exportCsvBtn: document.getElementById('export-csv'),
      
      errorText: document.getElementById('error-text'),
      
      // Deduplication elements
      deduplicateToggle: document.getElementById('deduplicate-toggle'),
      deduplicationInfo: document.getElementById('deduplication-info'),
      deduplicationStats: document.getElementById('deduplication-stats'),
      
      // Stopword filtering elements
      filterStopwordsToggle: document.getElementById('filter-stopwords-toggle'),
      stopwordFilterInfo: document.getElementById('stopword-filter-info'),
      stopwordFilterStats: document.getElementById('stopword-filter-stats'),
      
      // API Key elements
      apiKeyStatus: document.getElementById('api-key-status'),
      settingsBtn: document.getElementById('settings-btn'),
      settingsModal: document.getElementById('settings-modal'),
      closeModal: document.getElementById('close-modal'),
      apiKeyInput: document.getElementById('api-key-input'),
      toggleApiKey: document.getElementById('toggle-api-key'),
      saveApiKey: document.getElementById('save-api-key'),
      testApiKey: document.getElementById('test-api-key'),
      clearApiKey: document.getElementById('clear-api-key'),
      apiKeyStatusMessage: document.getElementById('api-key-status-message')
    };
  }

  bindEvents() {
    // Input events
    this.elements.textInput.addEventListener('input', (e) => {
      this.updateCharacterCount();
      this.updateAnalyzeButtonState();
    });

    // Button events
    this.elements.analyzeBtn.addEventListener('click', () => {
      this.triggerAnalysis();
    });

    this.elements.clearBtn.addEventListener('click', () => {
      this.clearInput();
    });

    this.elements.retryBtn.addEventListener('click', () => {
      this.triggerAnalysis();
    });

    // Export events
    this.elements.exportJsonBtn.addEventListener('click', () => {
      this.exportResults('json');
    });

    this.elements.exportCsvBtn.addEventListener('click', () => {
      this.exportResults('csv');
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'Enter':
            e.preventDefault();
            if (!this.state.isAnalyzing) {
              this.triggerAnalysis();
            }
            break;
          case 'l':
            e.preventDefault();
            this.elements.textInput.focus();
            break;
        }
      }
    });

    // Language selection
    this.elements.languageSelect.addEventListener('change', () => {
      this.updateAnalyzeButtonState();
    });

    // API Key modal events
    this.elements.settingsBtn.addEventListener('click', () => {
      this.showSettingsModal();
    });

    this.elements.closeModal.addEventListener('click', () => {
      this.hideSettingsModal();
    });

    this.elements.settingsModal.addEventListener('click', (e) => {
      if (e.target === this.elements.settingsModal) {
        this.hideSettingsModal();
      }
    });

    this.elements.toggleApiKey.addEventListener('click', () => {
      this.toggleApiKeyVisibility();
    });

    this.elements.saveApiKey.addEventListener('click', () => {
      this.saveApiKey();
    });

    this.elements.testApiKey.addEventListener('click', () => {
      this.testApiKey();
    });

    this.elements.clearApiKey.addEventListener('click', () => {
      this.clearApiKey();
    });

    this.elements.apiKeyInput.addEventListener('input', () => {
      this.clearApiKeyStatusMessage();
    });

    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.elements.settingsModal.style.display === 'flex') {
        this.hideSettingsModal();
      }
    });
  }

  updateCharacterCount() {
    const text = this.elements.textInput.value;
    const count = text.length;
    this.elements.characterCount.textContent = `${count.toLocaleString()} characters`;
    this.state.currentText = text;
    
    // Update character count color based on length
    if (count > 900000) {
      this.elements.characterCount.style.color = 'var(--error-color)';
    } else if (count > 500000) {
      this.elements.characterCount.style.color = 'var(--warning-color)';
    } else {
      this.elements.characterCount.style.color = 'var(--text-secondary)';
    }
  }

  updateAnalyzeButtonState() {
    const text = this.elements.textInput.value.trim();
    const hasText = text.length > 0;
    const isNotTooLong = text.length <= 1000000;
    
    this.elements.analyzeBtn.disabled = this.state.isAnalyzing || !hasText || !isNotTooLong;
    
    if (!hasText) {
      this.elements.analyzeBtn.textContent = 'Enter text to analyze';
    } else if (!isNotTooLong) {
      this.elements.analyzeBtn.textContent = 'Text too long';
    } else if (this.state.isAnalyzing) {
      this.elements.analyzeBtn.textContent = 'Analyzing...';
    } else {
      this.elements.analyzeBtn.textContent = 'Analyze Text';
    }
  }

  triggerAnalysis() {
    if (this.state.isAnalyzing) return;
    
    const text = this.elements.textInput.value.trim();
    const language = this.elements.languageSelect.value;
    const deduplicate = this.elements.deduplicateToggle.checked;
    const filterStopwords = this.elements.filterStopwordsToggle.checked;
    
    if (!text) {
      this.showError('Please enter some text to analyze.');
      return;
    }

    // Trigger analysis event
    const event = new CustomEvent('analyzeText', {
      detail: { text, language, deduplicate, filterStopwords }
    });
    document.dispatchEvent(event);
  }

  clearInput() {
    this.elements.textInput.value = '';
    this.elements.textInput.focus();
    this.updateCharacterCount();
    this.updateAnalyzeButtonState();
    this.hideAllSections();
  }

  showLoading() {
    this.state.isAnalyzing = true;
    this.updateAnalyzeButtonState();
    this.hideAllSections();
    this.elements.loadingSection.style.display = 'block';
  }

  hideLoading() {
    this.state.isAnalyzing = false;
    this.updateAnalyzeButtonState();
    this.elements.loadingSection.style.display = 'none';
  }

  showError(message) {
    this.hideLoading();
    this.hideAllSections();
    this.elements.errorText.textContent = message;
    this.elements.errorSection.style.display = 'block';
  }

  showResults(analysisResult) {
    this.hideLoading();
    this.hideAllSections();
    this.state.lastAnalysis = analysisResult;
    
    this.populateResults(analysisResult);
    this.elements.resultsSection.style.display = 'block';
    this.elements.resultsSection.classList.add('fade-in');
  }

  hideAllSections() {
    this.elements.loadingSection.style.display = 'none';
    this.elements.errorSection.style.display = 'none';
    this.elements.resultsSection.style.display = 'none';
  }

  populateResults(analysisResult) {
    const { entities, language, totalEntities, deduplicationApplied, originalCount, 
            stopwordFilteringApplied, filteredCount } = analysisResult;
    
    // Update analysis info
    this.elements.detectedLanguage.textContent = this.getLanguageName(language);
    this.elements.entityCount.textContent = totalEntities;
    
    // Show deduplication info if applicable
    if (deduplicationApplied && originalCount > filteredCount) {
      this.elements.deduplicationInfo.style.display = 'inline';
      this.elements.deduplicationStats.textContent = `${filteredCount} → ${totalEntities} entities`;
    } else {
      this.elements.deduplicationInfo.style.display = 'none';
    }
    
    // Show stopword filtering info if applicable
    if (stopwordFilteringApplied && originalCount > filteredCount) {
      this.elements.stopwordFilterInfo.style.display = 'inline';
      this.elements.stopwordFilterStats.textContent = `${originalCount} → ${filteredCount} entities`;
    } else {
      this.elements.stopwordFilterInfo.style.display = 'none';
    }
    
    // Populate entities list
    this.populateEntitiesList(entities);
    
    // Highlight entities in text
    this.populateHighlightedText(this.state.currentText, entities);
  }

  populateEntitiesList(entities) {
    const container = this.elements.entitiesList;
    container.innerHTML = '';
    
    if (!entities || entities.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>No entities found</h3>
          <p>Try analyzing a different text or check the language settings.</p>
        </div>
      `;
      return;
    }

    entities.forEach(entity => {
      const entityCard = this.createEntityCard(entity);
      container.appendChild(entityCard);
    });
  }

  createEntityCard(entity) {
    const card = document.createElement('div');
    const baseClass = entity.isDeduplicated ? 'entity-card deduplicated' : 'entity-card';
    const classificationClass = entity.salienceClassification ? `salience-${entity.salienceClassification.category}` : '';
    card.className = `${baseClass} ${classificationClass}`;
    
    // Use practical score if available, otherwise convert salience to percentage
    const displayScore = entity.practicalScore || Math.round(entity.salience * 100);
    const classification = entity.salienceClassification;
    
    card.innerHTML = `
      <div class="entity-header">
        <div class="entity-info">
          <div class="entity-name">${this.escapeHtml(entity.name)}</div>
          <div class="entity-type entity-type-${entity.type.toLowerCase()}">${entity.typeName}</div>
          ${classification ? `
            <div class="salience-classification">
              <span class="classification-badge" style="background-color: ${classification.color}">
                ${classification.icon} ${classification.label}
              </span>
              <span class="classification-description">${classification.description}</span>
            </div>
          ` : ''}
        </div>
        <div class="entity-salience">
          <div class="salience-score">${displayScore}/100</div>
          <div class="salience-bar">
            <div class="salience-fill" style="width: ${displayScore}%; background-color: ${classification?.color || '#3182ce'}"></div>
          </div>
        </div>
      </div>
      
      ${entity.isDeduplicated ? `
        <div class="deduplicated-info">
          <span class="info-icon">🔗</span> Merged from ${entity.originalEntities} entities: ${entity.originalNames.join(', ')}
        </div>
      ` : ''}
      
      ${entity.salienceFactors ? this.createFactorsSection(entity.salienceFactors) : ''}
      
      ${entity.optimizationSuggestions && entity.optimizationSuggestions.length > 0 ? 
        this.createSuggestionsSection(entity.optimizationSuggestions) : ''}
      
      ${entity.wikipediaUrl ? `
        <div class="entity-metadata">
          <a href="${entity.wikipediaUrl}" target="_blank" rel="noopener noreferrer" class="entity-wikipedia">
            📖 Wikipedia
          </a>
        </div>
      ` : ''}
      
      <div class="entity-mentions">
        <div class="entity-mentions-title">
          <span>Mentions (${entity.mentions.length})</span>
          ${entity.salienceFactors?.mentionTypes ? `
            <span class="mentions-quality ${entity.salienceFactors.mentionTypes.quality}">
              ${entity.salienceFactors.mentionTypes.description}
            </span>
          ` : ''}
        </div>
        <div class="entity-mentions-list">
          ${entity.mentions.map((mention, index) => `
            <span class="mention-tag ${mention.type?.toLowerCase() || 'common'}" 
                  title="Position: ${mention.beginOffset}, Type: ${mention.type}">
              ${this.escapeHtml(mention.text)}
            </span>
          `).join('')}
        </div>
      </div>
    `;
    
    // Add event listeners for interactive elements
    this.addCardEventListeners(card);
    
    return card;
  }

  createFactorsSection(factors) {
    return `
      <div class="salience-factors">
        <div class="factors-header">
          <span class="factors-title">📊 Analisi Fattori</span>
          <button class="toggle-factors">
            <span class="toggle-icon">▼</span>
          </button>
        </div>
        <div class="factors-content">
          <div class="factor-item">
            <span class="factor-label">Frequenza:</span>
            <span class="factor-value ${factors.frequency.rating}">${factors.frequency.description}</span>
          </div>
          <div class="factor-item">
            <span class="factor-label">Posizione:</span>
            <span class="factor-value">${factors.position.description}</span>
          </div>
          <div class="factor-item">
            <span class="factor-label">Contesto:</span>
            <span class="factor-value">${factors.context.description}</span>
          </div>
        </div>
      </div>
    `;
  }

  createSuggestionsSection(suggestions) {
    const highPriority = suggestions.filter(s => s.priority === 'high');
    const otherSuggestions = suggestions.filter(s => s.priority !== 'high');
    
    return `
      <div class="optimization-suggestions">
        <div class="suggestions-header">
          <span class="suggestions-title">💡 Suggerimenti</span>
          <button class="toggle-suggestions">
            <span class="toggle-icon">▼</span>
          </button>
        </div>
        <div class="suggestions-content">
          ${highPriority.map(suggestion => `
            <div class="suggestion-item priority-${suggestion.priority}">
              <div class="suggestion-header">
                <span class="suggestion-icon">${suggestion.icon}</span>
                <span class="suggestion-title">${suggestion.title}</span>
                <span class="suggestion-priority ${suggestion.priority}">${suggestion.priority.toUpperCase()}</span>
              </div>
              <div class="suggestion-description">${suggestion.description}</div>
              <div class="suggestion-actionable">${suggestion.actionable}</div>
            </div>
          `).join('')}
          ${otherSuggestions.length > 0 ? `
            <div class="more-suggestions">
              <button class="show-all-suggestions">
                +${otherSuggestions.length} altri suggerimenti
              </button>
              <div class="additional-suggestions">
                ${otherSuggestions.map(suggestion => `
                  <div class="suggestion-item priority-${suggestion.priority}">
                    <div class="suggestion-header">
                      <span class="suggestion-icon">${suggestion.icon}</span>
                      <span class="suggestion-title">${suggestion.title}</span>
                    </div>
                    <div class="suggestion-description">${suggestion.description}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  addCardEventListeners(card) {
    // Toggle factors section
    const factorsToggle = card.querySelector('.toggle-factors');
    if (factorsToggle) {
      factorsToggle.addEventListener('click', () => {
        const factorsSection = card.querySelector('.salience-factors');
        factorsSection.classList.toggle('expanded');
      });
    }

    // Toggle suggestions section
    const suggestionsToggle = card.querySelector('.toggle-suggestions');
    if (suggestionsToggle) {
      suggestionsToggle.addEventListener('click', () => {
        const suggestionsSection = card.querySelector('.optimization-suggestions');
        suggestionsSection.classList.toggle('expanded');
      });
    }

    // Show all suggestions button
    const showAllButton = card.querySelector('.show-all-suggestions');
    if (showAllButton) {
      showAllButton.addEventListener('click', () => {
        const suggestionsSection = card.querySelector('.optimization-suggestions');
        suggestionsSection.classList.toggle('show-all');
        
        // Update button text
        const isShowingAll = suggestionsSection.classList.contains('show-all');
        const otherSuggestionsCount = card.querySelectorAll('.additional-suggestions .suggestion-item').length;
        showAllButton.textContent = isShowingAll ? 
          'Nascondi suggerimenti aggiuntivi' : 
          `+${otherSuggestionsCount} altri suggerimenti`;
      });
    }
  }

  populateHighlightedText(originalText, entities) {
    const container = this.elements.highlightedContent;
    
    if (!originalText || !entities || entities.length === 0) {
      container.innerHTML = this.escapeHtml(originalText || '');
      return;
    }

    // Use analyzer to highlight entities
    const analyzer = new EntityAnalyzer();
    const highlightedText = analyzer.highlightEntitiesInText(originalText, entities);
    container.innerHTML = highlightedText;
    
    // Add click events to highlighted entities
    container.querySelectorAll('.highlighted-entity').forEach(element => {
      element.addEventListener('click', (e) => {
        const entityName = e.target.dataset.entity;
        const entityType = e.target.dataset.type;
        const salience = e.target.dataset.salience;
        
        this.showEntityPopup(entityName, entityType, salience, e.target);
      });
    });
  }

  showEntityPopup(entityName, entityType, salience, element) {
    // Simple tooltip-like popup
    const popup = document.createElement('div');
    popup.className = 'entity-popup';
    popup.innerHTML = `
      <strong>${this.escapeHtml(entityName)}</strong><br>
      Type: ${entityType}<br>
      Salience: ${(parseFloat(salience) * 100).toFixed(1)}%
    `;
    
    popup.style.cssText = `
      position: absolute;
      background: var(--text-primary);
      color: var(--background-color);
      padding: var(--spacing-sm);
      border-radius: var(--border-radius);
      font-size: var(--font-size-small);
      box-shadow: var(--shadow-medium);
      z-index: 1000;
      max-width: 200px;
      pointer-events: none;
    `;
    
    document.body.appendChild(popup);
    
    const rect = element.getBoundingClientRect();
    popup.style.left = rect.left + 'px';
    popup.style.top = (rect.bottom + 5) + 'px';
    
    // Remove popup after 3 seconds
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 3000);
  }

  exportResults(format) {
    if (!this.state.lastAnalysis) {
      this.showError('No analysis results to export.');
      return;
    }

    const analyzer = new EntityAnalyzer();
    let content, filename, mimeType;

    switch (format) {
      case 'json':
        content = analyzer.exportToJSON(this.state.lastAnalysis);
        filename = 'entity-analysis.json';
        mimeType = 'application/json';
        break;
      case 'csv':
        content = analyzer.exportToCSV(this.state.lastAnalysis);
        filename = 'entity-analysis.csv';
        mimeType = 'text/csv';
        break;
      default:
        this.showError('Unknown export format.');
        return;
    }

    this.downloadFile(content, filename, mimeType);
  }

  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  }

  getLanguageName(languageCode) {
    const languages = {
      'it': 'Italian',
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese'
    };
    
    return languages[languageCode] || languageCode || 'Unknown';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--primary-color);
      color: white;
      padding: var(--spacing-md);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-medium);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    
    if (type === 'error') {
      toast.style.background = 'var(--error-color)';
    } else if (type === 'success') {
      toast.style.background = 'var(--success-color)';
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  // API Key Management Methods
  updateApiKeyStatus() {
    const apiKey = localStorage.getItem('google-nlp-api-key');
    const statusElement = this.elements.apiKeyStatus;
    
    if (apiKey && apiKey.trim()) {
      statusElement.textContent = 'API Key: Configured';
      statusElement.className = 'api-key-indicator configured';
    } else {
      statusElement.textContent = 'API Key: Not configured';
      statusElement.className = 'api-key-indicator error';
    }
  }

  showSettingsModal() {
    this.elements.settingsModal.style.display = 'flex';
    
    // Load current API key (masked)
    const apiKey = localStorage.getItem('google-nlp-api-key');
    if (apiKey) {
      this.elements.apiKeyInput.value = apiKey;
    }
    
    this.elements.apiKeyInput.focus();
  }

  hideSettingsModal() {
    this.elements.settingsModal.style.display = 'none';
    this.clearApiKeyStatusMessage();
  }

  toggleApiKeyVisibility() {
    const input = this.elements.apiKeyInput;
    const button = this.elements.toggleApiKey;
    
    if (input.type === 'password') {
      input.type = 'text';
      button.textContent = 'Hide';
    } else {
      input.type = 'password';
      button.textContent = 'Show';
    }
  }

  saveApiKey() {
    const apiKey = this.elements.apiKeyInput.value.trim();
    
    if (!apiKey) {
      this.showApiKeyStatusMessage('Please enter an API key', 'error');
      return;
    }

    try {
      // Create a temporary API instance to validate the key
      const tempApi = new NaturalLanguageAPI();
      tempApi.validateApiKey(apiKey);
      
      // If validation passes, save the key
      tempApi.setApiKey(apiKey);
      
      this.showApiKeyStatusMessage('API key saved successfully', 'success');
      this.updateApiKeyStatus();
      
      // Close modal after a short delay
      setTimeout(() => {
        this.hideSettingsModal();
      }, 1500);
      
    } catch (error) {
      this.showApiKeyStatusMessage(error.message, 'error');
    }
  }

  async testApiKey() {
    const apiKey = this.elements.apiKeyInput.value.trim();
    
    if (!apiKey) {
      this.showApiKeyStatusMessage('Please enter an API key to test', 'error');
      return;
    }

    this.showApiKeyStatusMessage('Testing API key...', 'info');
    this.elements.testApiKey.disabled = true;
    this.elements.testApiKey.textContent = 'Testing...';

    try {
      const tempApi = new NaturalLanguageAPI();
      tempApi.setApiKey(apiKey);
      
      // Test with a simple text
      const testText = 'Hello world';
      await tempApi.analyzeEntities(testText);
      
      this.showApiKeyStatusMessage('API key is valid and working!', 'success');
      
    } catch (error) {
      let message = 'API key test failed';
      if (error instanceof window.APIError) {
        message = error.getUserMessage();
      } else if (error.message) {
        message = error.message;
      }
      
      this.showApiKeyStatusMessage(message, 'error');
    } finally {
      this.elements.testApiKey.disabled = false;
      this.elements.testApiKey.textContent = 'Test API Key';
    }
  }

  clearApiKey() {
    if (confirm('Are you sure you want to clear the API key?')) {
      localStorage.removeItem('google-nlp-api-key');
      this.elements.apiKeyInput.value = '';
      this.showApiKeyStatusMessage('API key cleared', 'info');
      this.updateApiKeyStatus();
    }
  }

  showApiKeyStatusMessage(message, type) {
    const messageElement = this.elements.apiKeyStatusMessage;
    messageElement.textContent = message;
    messageElement.className = `api-key-status-message ${type}`;
    
    // Clear input styling
    this.elements.apiKeyInput.className = 'api-key-input';
    
    // Add input styling based on message type
    if (type === 'error') {
      this.elements.apiKeyInput.classList.add('error');
    } else if (type === 'success') {
      this.elements.apiKeyInput.classList.add('success');
    }
  }

  clearApiKeyStatusMessage() {
    this.elements.apiKeyStatusMessage.className = 'api-key-status-message';
    this.elements.apiKeyInput.className = 'api-key-input';
  }
}

// Export for use in other modules
window.UIManager = UIManager;