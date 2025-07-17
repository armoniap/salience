// Main Application Logic

class SalienceApp {
  constructor() {
    this.api = null;
    this.analyzer = null;
    this.ui = null;
    this.initialized = false;
    this.init();
  }

  async init() {
    try {
      // Initialize components
      this.api = new NaturalLanguageAPI();
      this.analyzer = new EntityAnalyzer();
      this.ui = new UIManager();

      // Bind events
      this.bindEvents();

      // Set initial state
      this.ui.updateCharacterCount();
      this.ui.updateAnalyzeButtonState();

      this.initialized = true;
      console.log('Salience App initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app:', error);
      this.showInitializationError(error);
    }
  }

  bindEvents() {
    // Listen for analysis requests from UI
    document.addEventListener('analyzeText', (event) => {
      this.handleAnalysisRequest(event.detail);
    });

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAnalysis();
      } else {
        this.resumeAnalysis();
      }
    });

    // Handle online/offline status
    window.addEventListener('online', () => {
      this.ui.showToast('Connection restored', 'success');
    });

    window.addEventListener('offline', () => {
      this.ui.showToast('Connection lost', 'error');
    });

    // Handle unhandled errors
    window.addEventListener('error', (event) => {
      console.error('Unhandled error:', event.error);
      this.handleUnexpectedError(event.error);
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.handleUnexpectedError(event.reason);
    });
  }

  async handleAnalysisRequest(requestData) {
    if (!this.initialized) {
      this.ui.showError('Application not initialized. Please refresh the page.');
      return;
    }

    const { text, language } = requestData;

    try {
      // Validate input
      this.api.validateInput(text);

      // Check network connectivity
      if (!navigator.onLine) {
        throw new Error('No internet connection. Please check your network and try again.');
      }

      // Show loading state
      this.ui.showLoading();

      // Perform analysis
      const apiResponse = await this.api.analyzeEntities(text, language);
      const analysisResult = this.analyzer.processEntities(apiResponse);

      // Validate result
      this.analyzer.validateAnalysisResult(analysisResult);

      // Show results
      this.ui.showResults(analysisResult);

      // Log success
      console.log('Analysis completed successfully:', {
        entitiesFound: analysisResult.totalEntities,
        language: analysisResult.language,
        textLength: text.length
      });

      // Show success toast
      this.ui.showToast(`Found ${analysisResult.totalEntities} entities`, 'success');

    } catch (error) {
      console.error('Analysis failed:', error);
      this.handleAnalysisError(error);
    }
  }

  handleAnalysisError(error) {
    let errorMessage;

    if (error instanceof window.ValidationError) {
      errorMessage = error.message;
    } else if (error instanceof window.APIError) {
      errorMessage = error.getUserMessage();
    } else if (error.message) {
      errorMessage = error.message;
    } else {
      errorMessage = 'An unexpected error occurred. Please try again.';
    }

    this.ui.showError(errorMessage);
    this.ui.showToast('Analysis failed', 'error');
  }

  handleUnexpectedError(error) {
    console.error('Unexpected error:', error);
    
    if (this.ui) {
      this.ui.showToast('An unexpected error occurred', 'error');
    }

    // Report error to console for debugging
    if (error.stack) {
      console.error('Error stack:', error.stack);
    }
  }

  showInitializationError(error) {
    const errorMessage = document.createElement('div');
    errorMessage.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--error-color);
      color: white;
      padding: var(--spacing-lg);
      border-radius: var(--border-radius);
      text-align: center;
      z-index: 1000;
      max-width: 400px;
    `;
    
    errorMessage.innerHTML = `
      <h3>Initialization Error</h3>
      <p>The application failed to initialize properly.</p>
      <p>Error: ${error.message}</p>
      <button onclick="location.reload()" style="
        background: white;
        color: var(--error-color);
        border: none;
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: var(--border-radius);
        cursor: pointer;
        margin-top: var(--spacing-md);
      ">Reload Page</button>
    `;
    
    document.body.appendChild(errorMessage);
  }

  pauseAnalysis() {
    // Pause any ongoing analysis if needed
    console.log('Analysis paused due to page visibility change');
  }

  resumeAnalysis() {
    // Resume analysis if needed
    console.log('Analysis resumed');
  }

  // Public API methods
  getAnalysisStats() {
    if (!this.ui.state.lastAnalysis) {
      return null;
    }
    
    return this.analyzer.getAnalysisStats(this.ui.state.lastAnalysis);
  }

  exportLastAnalysis(format) {
    if (!this.ui.state.lastAnalysis) {
      console.warn('No analysis to export');
      return;
    }
    
    this.ui.exportResults(format);
  }

  clearAnalysis() {
    this.ui.clearInput();
  }

  // Debugging methods
  debug() {
    return {
      initialized: this.initialized,
      lastAnalysis: this.ui ? this.ui.state.lastAnalysis : null,
      apiKey: this.api ? this.api.apiKey.substring(0, 10) + '...' : null,
      version: '1.0.0'
    };
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.salienceApp = new SalienceApp();
});

// Export for debugging
window.SalienceApp = SalienceApp;