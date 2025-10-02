const NeoSpeech = require('../src/index');

async function main() {
  const neospeech = new NeoSpeech(process.env.NEOSPEECH_API_KEY);

  console.log('Fetching available models...\n');

  const { models, total, default_model } = await neospeech.models.list();

  console.log(`Total models: ${total}`);
  console.log(`Default model: ${default_model}\n`);

  models.forEach(model => {
    console.log(`${model.name} (${model.shortname})`);
    console.log(`  Quality: ${model.quality}`);
    console.log(`  Description: ${model.description}`);
    console.log(`  Format: ${model.specifications.format}`);
    console.log(`  Sample Rate: ${model.specifications.sample_rate}`);
    console.log(`  Bitrate: ${model.specifications.bitrate}`);
    if (model.avg_latency_ms) {
      console.log(`  Avg Latency: ${model.avg_latency_ms}ms`);
    }
    console.log(`  Use Cases: ${model.use_cases.join(', ')}`);
    console.log('');
  });
}

main().catch(console.error);
