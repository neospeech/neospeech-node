const { NeoSpeechError } = require('./error');

class Audio {
  constructor(client) {
    this.client = client;
  }

  async speech(options) {
    const { input, voice, model = 'aurora-4', ...params } = options;

    if (!input) {
      throw new NeoSpeechError('Input text is required', 'MISSING_INPUT', 400);
    }

    if (!voice) {
      throw new NeoSpeechError('Voice is required', 'MISSING_VOICE', 400);
    }

    if (input.length > 5000) {
      throw new NeoSpeechError(
        'Input exceeds 5000 character limit',
        'TEXT_TOO_LONG',
        400
      );
    }

    const body = { input, voice, model, ...params };

    const response = await this.client.request('/audio/speech', {
      method: 'POST',
      body: JSON.stringify(body)
    });

    return response.arrayBuffer();
  }

  async stream(options) {
    const { input, voice, model = 'aurora-4', ...params } = options;

    if (!input) {
      throw new NeoSpeechError('Input text is required', 'MISSING_INPUT', 400);
    }

    if (!voice) {
      throw new NeoSpeechError('Voice is required', 'MISSING_VOICE', 400);
    }

    if (input.length > 5000) {
      throw new NeoSpeechError(
        'Input exceeds 5000 character limit',
        'TEXT_TOO_LONG',
        400
      );
    }

    const body = { input, voice, model, ...params };

    const response = await this.client.request('/audio/stream', {
      method: 'POST',
      body: JSON.stringify(body)
    });

    return response.body;
  }
}

module.exports = { Audio };
