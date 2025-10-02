# NeoSpeech Node.js SDK

Official Node.js SDK for the NeoSpeech Text-to-Speech API. Convert text into natural-sounding speech with 50+ voices in 90+ languages.

## Installation

```bash
npm install neospeech-io
```

## Quick Start

```javascript
const NeoSpeech = require('neospeech-io');

const neospeech = new NeoSpeech('your-api-key');

// Generate speech
const audio = await neospeech.audio.speech({
  input: "Hello, world!",
  voice: "lyra",
  model: "aurora-4"
});

// Save to file
const fs = require('fs');
fs.writeFileSync('output.mp3', Buffer.from(audio));
```

## Authentication

Get your API key from the [NeoSpeech dashboard](https://neospeech.io). Pro or Business plan required.

```javascript
const neospeech = new NeoSpeech(process.env.NEOSPEECH_API_KEY);
```

## Usage

### Generate Speech

Convert text to audio with high-quality voices:

```javascript
const audio = await neospeech.audio.speech({
  input: "Welcome to NeoSpeech!",
  voice: "lyra",
  model: "aurora-4"
});

// audio is an ArrayBuffer
const buffer = Buffer.from(audio);
fs.writeFileSync('speech.mp3', buffer);
```

### Stream Speech

Stream audio in real-time for lower latency:

```javascript
const stream = await neospeech.audio.stream({
  input: "This is streaming audio",
  voice: "kai",
  model: "turbo-3"
});

// stream is a ReadableStream
const chunks = [];
const reader = stream.getReader();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  chunks.push(value);
}

const audioBuffer = Buffer.concat(chunks);
fs.writeFileSync('stream.mp3', audioBuffer);
```

### Advanced Options

Customize voice characteristics:

```javascript
const audio = await neospeech.audio.speech({
  input: "Professional narration",
  voice: "emma",
  model: "aurora-3.5",
  pitch: "+10%",
  style: "cheerful",
  styleDegree: "1.5",
  lang: "en-US"
});
```

### List Voices

Explore available voices:

```javascript
const { voices, pagination } = await neospeech.voices.list({
  gender: "female",
  locale: "en-US",
  limit: 10
});

voices.forEach(voice => {
  console.log(`${voice.name} (${voice.id}): ${voice.language}`);
});
```

Filter and search:

```javascript
// Search by name
const results = await neospeech.voices.list({ search: "lyra" });

// Filter by gender and locale
const femaleVoices = await neospeech.voices.list({
  gender: "female",
  locale: "en-GB"
});

// Paginate results
const page1 = await neospeech.voices.list({ limit: 20, offset: 0 });
const page2 = await neospeech.voices.list({ limit: 20, offset: 20 });
```

### List Models

Get available audio models:

```javascript
const { models } = await neospeech.models.list();

models.forEach(model => {
  console.log(`${model.name}: ${model.quality} quality`);
});
```

### Check Balance

Monitor your credit usage:

```javascript
const { balance, plan, usage_summary } = await neospeech.balance.get();

console.log(`Remaining credits: ${balance.remaining_credits}`);
console.log(`Plan: ${plan.type}`);
console.log(`Usage this period: ${usage_summary.current_period_usage}`);
```

## API Reference

### NeoSpeech

Constructor options:

```javascript
const neospeech = new NeoSpeech(apiKey, {
  baseURL: 'https://api.neospeech.io/v1',  // Default
  timeout: 120000,                          // 120 seconds
  maxRetries: 3                             // Retry failed requests
});
```

### audio.speech(options)

Generate complete audio file.

**Parameters:**
- `input` (string, required) - Text to convert (max 5000 characters)
- `voice` (string, required) - Voice ID
- `model` (string, optional) - Model: `aurora-4`, `aurora-3.5`, `aurora-3`, `turbo-3`, `mini-2`
- `pitch` (string, optional) - Pitch adjustment (e.g., `+10%`, `-5%`)
- `style` (string, optional) - Voice style
- `styleDegree` (string, optional) - Style intensity
- `lang` (string, optional) - Language code

**Returns:** `Promise<ArrayBuffer>`

### audio.stream(options)

Stream audio in real-time.

**Parameters:** Same as `audio.speech()`

**Returns:** `Promise<ReadableStream>`

### voices.list(filters)

List available voices.

**Parameters:**
- `gender` (string, optional) - Filter by `male` or `female`
- `locale` (string, optional) - Filter by locale (e.g., `en-US`)
- `search` (string, optional) - Search by name or tags
- `limit` (number, optional) - Results per page
- `offset` (number, optional) - Pagination offset

**Returns:** `Promise<{ voices, pagination, filters_applied }>`

### models.list()

List available models.

**Returns:** `Promise<{ models, total, default_model }>`

### balance.get()

Get account balance and usage.

**Returns:** `Promise<{ balance, plan, usage_summary }>`

## Error Handling

The SDK throws `NeoSpeechError` for API errors:

```javascript
const { NeoSpeechError } = require('neospeech-io');

try {
  const audio = await neospeech.audio.speech({
    input: "Test",
    voice: "lyra"
  });
} catch (error) {
  if (error instanceof NeoSpeechError) {
    console.log(`Error [${error.code}]: ${error.message}`);
    console.log(`Status: ${error.status}`);
    console.log(`Retryable: ${error.retryable}`);

    if (error.isAuthError()) {
      console.log('Check your API key');
    } else if (error.isRateLimitError()) {
      console.log('Rate limit exceeded');
    }
  }
}
```

### Error Types

- `isClientError()` - 4xx errors (your request)
- `isServerError()` - 5xx errors (server issue)
- `isRateLimitError()` - 429 rate limit
- `isAuthError()` - 401/403 authentication

## Examples

### Save Audio to File

```javascript
const fs = require('fs');

async function generateAndSave(text, filename) {
  const audio = await neospeech.audio.speech({
    input: text,
    voice: "lyra",
    model: "aurora-4"
  });

  fs.writeFileSync(filename, Buffer.from(audio));
  console.log(`Saved to ${filename}`);
}

await generateAndSave("Hello, world!", "hello.mp3");
```

### Batch Processing

```javascript
async function batchGenerate(texts, voice, model) {
  const results = await Promise.all(
    texts.map(text =>
      neospeech.audio.speech({ input: text, voice, model })
    )
  );

  return results;
}

const texts = ["First message", "Second message", "Third message"];
const audios = await batchGenerate(texts, "kai", "turbo-3");
```

### Stream to Player

```javascript
async function streamToPlayer(text) {
  const stream = await neospeech.audio.stream({
    input: text,
    voice: "zara",
    model: "turbo-3"
  });

  const chunks = [];
  const reader = stream.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
    console.log(`Received ${value.length} bytes`);
  }

  const audioBlob = new Blob(chunks, { type: 'audio/mpeg' });
  // Play audioBlob in browser
}
```

### With Retry Logic

```javascript
async function generateWithRetry(text, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await neospeech.audio.speech({
        input: text,
        voice: "lyra",
        model: "aurora-4"
      });
    } catch (error) {
      if (error.retryable && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000;
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}
```

## TypeScript

Full TypeScript support included:

```typescript
import NeoSpeech, { SpeechOptions, NeoSpeechError } from 'neospeech-io';

const neospeech = new NeoSpeech(process.env.NEOSPEECH_API_KEY!);

const options: SpeechOptions = {
  input: "Hello, TypeScript!",
  voice: "lyra",
  model: "aurora-4"
};

const audio: ArrayBuffer = await neospeech.audio.speech(options);
```

## Requirements

- Node.js 18 or higher
- NeoSpeech API key (Pro or Business plan)

## Documentation

- [Full API Documentation](https://docs.neospeech.io)
- [Voice Gallery](https://neospeech.io/voices)
- [Pricing](https://neospeech.io/pricing)

## Support

- Email: support@neospeech.io
- Issues: [GitHub Issues](https://github.com/neospeech/neospeech-node/issues)
- Documentation: [docs.neospeech.io](https://docs.neospeech.io)

## License

MIT
