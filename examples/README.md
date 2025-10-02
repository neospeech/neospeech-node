# NeoSpeech SDK Examples

This directory contains working examples for all SDK features.

## Setup

Before running examples, set your API key:

```bash
export NEOSPEECH_API_KEY="your-api-key-here"
```

## Running Examples

From the `sdk` directory:

```bash
# Basic speech generation
node examples/basic.js

# Streaming audio
node examples/streaming.js

# List available voices
node examples/voices.js

# List available models
node examples/models.js

# Check account balance
node examples/balance.js

# Error handling patterns
node examples/error-handling.js

# Batch processing
node examples/batch-processing.js
```

## Examples Overview

### basic.js
Simple example showing how to generate speech and save to a file.

### streaming.js
Demonstrates real-time audio streaming with progress tracking.

### voices.js
Shows how to list and filter available voices.

### models.js
Displays all available audio models and their specifications.

### balance.js
Checks your account balance, plan type, and usage statistics.

### error-handling.js
Demonstrates proper error handling with the SDK.

### batch-processing.js
Shows how to process multiple texts efficiently in parallel.

## Using in Your Project

After installing the package, use it like this:

```javascript
const NeoSpeech = require('neospeech-io');

const neospeech = new NeoSpeech(process.env.NEOSPEECH_API_KEY);

const audio = await neospeech.audio.speech({
  input: "Hello, world!",
  voice: "lyra",
  model: "aurora-4"
});
```

## Notes

- Examples use relative imports (`../src/index`) for development
- In your project, use `require('neospeech-io')` after installation
- All examples require Node.js 18 or higher
- Generated audio files (*.mp3) are ignored by git
