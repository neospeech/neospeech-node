const NeoSpeech = require('../src/index');
const fs = require('fs');

async function main() {
  const neospeech = new NeoSpeech(process.env.NEOSPEECH_API_KEY);

  console.log('Generating speech...');

  const audio = await neospeech.audio.speech({
    input: "Hello from NeoSpeech! This is a basic example.",
    voice: "lyra",
    model: "aurora-4"
  });

  const buffer = Buffer.from(audio);
  fs.writeFileSync('output.mp3', buffer);

  console.log('Audio saved to output.mp3');
}

main().catch(console.error);
