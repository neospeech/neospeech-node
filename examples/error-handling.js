const NeoSpeech = require('../src/index');
const { NeoSpeechError } = require('../src/index');

async function main() {
  const neospeech = new NeoSpeech(process.env.NEOSPEECH_API_KEY);

  console.log('Testing error handling...\n');

  try {
    const audio = await neospeech.audio.speech({
      input: "This will succeed",
      voice: "lyra",
      model: "aurora-4"
    });

    console.log('✓ Speech generated successfully');
  } catch (error) {
    if (error instanceof NeoSpeechError) {
      console.log(`✗ Error: ${error.message}`);
      console.log(`  Code: ${error.code}`);
      console.log(`  Status: ${error.status}`);
      console.log(`  Retryable: ${error.retryable}`);
    }
  }

  try {
    const audio = await neospeech.audio.speech({
      input: "",
      voice: "lyra"
    });
  } catch (error) {
    console.log('\n✗ Expected error for empty input:');
    console.log(`  ${error.message}`);
  }

  try {
    const longText = "a".repeat(6000);
    const audio = await neospeech.audio.speech({
      input: longText,
      voice: "lyra"
    });
  } catch (error) {
    console.log('\n✗ Expected error for text too long:');
    console.log(`  ${error.message}`);
  }

  try {
    const audio = await neospeech.audio.speech({
      input: "Test",
      voice: "invalid-voice"
    });
  } catch (error) {
    if (error instanceof NeoSpeechError) {
      console.log('\n✗ Server error for invalid voice:');
      console.log(`  Message: ${error.message}`);
      console.log(`  Is Client Error: ${error.isClientError()}`);
      console.log(`  Is Auth Error: ${error.isAuthError()}`);
    }
  }
}

main().catch(console.error);
