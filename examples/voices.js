const NeoSpeech = require('../src/index');

async function main() {
  const neospeech = new NeoSpeech(process.env.NEOSPEECH_API_KEY);

  console.log('Fetching female US English voices...\n');

  const { voices, pagination } = await neospeech.voices.list({
    gender: "female",
    locale: "en-US"
  });

  console.log(`Found ${pagination.total} voices:\n`);

  voices.forEach(voice => {
    console.log(`${voice.name} (${voice.id})`);
    console.log(`  Language: ${voice.language}`);
    console.log(`  Gender: ${voice.gender}`);
    if (voice.tags) {
      console.log(`  Tags: ${voice.tags.join(', ')}`);
    }
    console.log('');
  });

  console.log('\nSearching for "lyra"...\n');

  const searchResults = await neospeech.voices.list({
    search: "lyra"
  });

  searchResults.voices.forEach(voice => {
    console.log(`${voice.name} (${voice.id}) - ${voice.language}`);
  });
}

main().catch(console.error);
