const NeoSpeech = require('../src/index');
const fs = require('fs');

async function main() {
  const neospeech = new NeoSpeech(process.env.NEOSPEECH_API_KEY);

  console.log('Streaming audio...');

  const stream = await neospeech.audio.stream({
    input: "This is a streaming example with real-time audio generation.",
    voice: "kai",
    model: "turbo-3"
  });

  const chunks = [];
  const reader = stream.getReader();

  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      console.log('Stream complete');
      break;
    }

    chunks.push(value);
    totalBytes += value.length;
    console.log(`Received chunk: ${value.length} bytes (total: ${totalBytes})`);
  }

  const audioBuffer = Buffer.concat(chunks);
  fs.writeFileSync('stream.mp3', audioBuffer);

  console.log(`Audio saved to stream.mp3 (${totalBytes} bytes)`);
}

main().catch(console.error);
