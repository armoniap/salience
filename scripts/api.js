// Google Cloud Natural Language API Integration

class NaturalLanguageAPI {
  constructor() {
    this.apiKey = this.getStoredApiKey();
    this.baseUrl = 'https://language.googleapis.com/v1/documents:analyzeEntities';
    this.maxRetries = 3;
    this.retryDelay = 1000;
  }

  getStoredApiKey() {
    return localStorage.getItem('google-nlp-api-key') || '';
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey;
    if (apiKey) {
      localStorage.setItem('google-nlp-api-key', apiKey);
    } else {
      localStorage.removeItem('google-nlp-api-key');
    }
  }

  hasApiKey() {
    return this.apiKey && this.apiKey.trim().length > 0;
  }

  validateApiKey(apiKey) {
    if (!apiKey || typeof apiKey !== 'string') {
      throw new ValidationError('API key is required and must be a string');
    }

    if (apiKey.trim().length === 0) {
      throw new ValidationError('API key cannot be empty');
    }

    if (!apiKey.startsWith('AIza')) {
      throw new ValidationError('Invalid Google API key format. It should start with "AIza"');
    }

    if (apiKey.length < 35 || apiKey.length > 45) {
      throw new ValidationError('Invalid Google API key length');
    }

    return true;
  }

  async analyzeEntities(text, language = 'auto') {
    if (!this.hasApiKey()) {
      throw new ValidationError('API key is required. Please configure your Google Cloud Natural Language API key.');
    }

    const document = {
      content: text,
      type: 'PLAIN_TEXT'
    };

    if (language !== 'auto') {
      document.language = language;
    }

    const requestBody = {
      document,
      encodingType: 'UTF8'
    };

    const url = `${this.baseUrl}?key=${this.apiKey}`;

    let lastError;
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const error = new APIError(
            response.status,
            errorData.error?.message || `HTTP ${response.status}`,
            errorData.error?.code || 'UNKNOWN_ERROR'
          );
          
          if (response.status === 429 && attempt < this.maxRetries) {
            await this.delay(this.retryDelay * attempt);
            continue;
          }
          
          throw error;
        }

        const data = await response.json();
        return this.processResponse(data);
      } catch (error) {
        lastError = error;
        
        if (error instanceof APIError) {
          throw error;
        }
        
        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt);
          continue;
        }
      }
    }

    throw new APIError(0, 'Network error after retries', 'NETWORK_ERROR');
  }

  processResponse(data) {
    return {
      entities: data.entities || [],
      language: data.language || 'unknown',
      raw: data
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  validateInput(text) {
    if (!text || typeof text !== 'string') {
      throw new ValidationError('Text input is required and must be a string');
    }

    if (text.trim().length === 0) {
      throw new ValidationError('Text input cannot be empty');
    }

    if (text.length > 1000000) {
      throw new ValidationError('Text input is too long (max 1,000,000 characters)');
    }

    return true;
  }

  getSupportedLanguages() {
    return [
      { code: 'auto', name: 'Auto-detect' },
      { code: 'it', name: 'Italian' },
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'zh', name: 'Chinese' }
    ];
  }
}

class APIError extends Error {
  constructor(status, message, code) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
  }

  getUserMessage() {
    switch (this.status) {
      case 400:
        return 'Invalid request. Please check your input text.';
      case 401:
        return 'Authentication failed. Please check the API key.';
      case 403:
        return 'API quota exceeded. Please try again later.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        if (this.code === 'NETWORK_ERROR') {
          return 'Network error. Please check your internet connection and try again.';
        }
        return `An error occurred: ${this.message}`;
    }
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Export for use in other modules
window.NaturalLanguageAPI = NaturalLanguageAPI;
window.APIError = APIError;
window.ValidationError = ValidationError;