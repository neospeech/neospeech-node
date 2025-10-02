const NeoSpeech = require('../src/index');

async function main() {
  const neospeech = new NeoSpeech(process.env.NEOSPEECH_API_KEY);

  console.log('Checking account balance...\n');

  const { balance, plan, usage_summary } = await neospeech.balance.get();

  console.log('Balance Information:');
  console.log(`  Total Credits: ${balance.total_credits.toLocaleString()}`);
  console.log(`  Used Credits: ${balance.used_credits.toLocaleString()}`);
  console.log(`  Remaining Credits: ${balance.remaining_credits.toLocaleString()}`);

  if (balance.overage_characters) {
    console.log(`  Overage Characters: ${balance.overage_characters.toLocaleString()}`);
    console.log(`  Overage Amount: $${balance.overage_amount_usd.toFixed(2)}`);
  }

  console.log('\nPlan Information:');
  console.log(`  Plan Type: ${plan.type}`);
  console.log(`  Next Reset: ${plan.next_reset || 'N/A'}`);

  console.log('\nUsage Summary:');
  console.log(`  Total Characters Used: ${usage_summary.total_characters_used.toLocaleString()}`);
  console.log(`  Current Period Usage: ${usage_summary.current_period_usage.toLocaleString()}`);
  console.log(`  Overage Rate: $${usage_summary.overage_rate_per_1000} per 1000 characters`);
}

main().catch(console.error);
