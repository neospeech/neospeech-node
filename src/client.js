const { NeoSpeechError } = require('./error');
const { Audio } = require('./audio');
const { Voices } = require('./voices');
const { Models } = require('./models');
const { Balance } = require('./balance');

class NeoSpeech {
  constructor(apiKey, options = {}) {
    if (!apiKey) {
      throw new NeoSpeechError(
        'API key is required',
        'MISSING_API_KEY',
        401
      );
    }

    this.apiKey = apiKey;
    this.baseURL = options.baseURL || 'https://api.neospeech.io/v1';
    this.timeout = options.timeout || 120000;
    this.maxRetries = options.maxRetries || 3;

    this.audio = new Audio(this);
    this.voices = new Voices(this);
    this.models = new Models(this);
    this.balance = new Balance(this);
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'neospeech-node/1.0.0',
      ...options.headers
    };

    const config = {
      ...options,
      headers
    };

    let lastError;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const error = await this.parseError(response);

          if (error.retryable && attempt < this.maxRetries - 1) {
            const delay = Math.pow(2, attempt) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          throw error;
        }

        return response;
      } catch (error) {
        lastError = error;

        if (error.name === 'AbortError') {
          throw new NeoSpeechError(
            'Request timeout',
            'TIMEOUT',
            408,
            true
          );
        }

        if (error instanceof NeoSpeechError) {
          throw error;
        }

        if (attempt === this.maxRetries - 1) {
          throw new NeoSpeechError(
            error.message || 'Request failed',
            'REQUEST_FAILED',
            500,
            false
          );
        }

        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  async parseError(response) {
    let errorData;

    try {
      errorData = await response.json();
    } catch {
      errorData = { message: `HTTP ${response.status}` };
    }

    return new NeoSpeechError(
      errorData.message || `HTTP ${response.status}`,
      errorData.error_code || 'UNKNOWN_ERROR',
      response.status,
      errorData.retryable || response.status >= 500
    );
  }
}

module.exports = NeoSpeech;
