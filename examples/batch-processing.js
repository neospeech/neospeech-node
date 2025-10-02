const NeoSpeech = require('../src/index');
const fs = require('fs');

async function main() {
  const neospeech = new NeoSpeech(process.env.NEOSPEECH_API_KEY);

  const texts = [
    "First message to convert",
    "Second message to convert",
    "Third message to convert"
  ];

  console.log(`Processing ${texts.length} texts...\n`);

  const startTime = Date.now();

  const results = await Promise.all(
    texts.map((text, index) =>
      neospeech.audio.speech({
        input: text,
        voice: "kai",
        model: "turbo-3"
      }).then(audio => ({ index, audio, text }))
    )
  );

  const totalTime = Date.now() - startTime;

  console.log(`Completed in ${totalTime}ms\n`);

  results.forEach(({ index, audio, text }) => {
    const filename = `batch-${index + 1}.mp3`;
    fs.writeFileSync(filename, Buffer.from(audio));
    console.log(`✓ ${filename}: "${text.substring(0, 30)}..."`);
  });

  console.log(`\nAll ${results.length} files saved`);
}

main().catch(console.error);
