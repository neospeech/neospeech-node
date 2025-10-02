class NeoSpeechError extends Error {
  constructor(message, code, status, retryable = false) {
    super(message);
    this.name = 'NeoSpeechError';
    this.code = code;
    this.status = status;
    this.retryable = retryable;
    Error.captureStackTrace(this, this.constructor);
  }

  isClientError() {
    return this.status >= 400 && this.status < 500;
  }

  isServerError() {
    return this.status >= 500;
  }

  isRateLimitError() {
    return this.status === 429;
  }

  isAuthError() {
    return this.status === 401 || this.status === 403;
  }
}

module.exports = { NeoSpeechError };
