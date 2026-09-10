import fs from 'fs';

const TEST_CASES = [
  "What is Next.js?",
  "What is 5 + 5?",
  "How many annual leave days are provided?",
  "What is the inspection approval procedure?",
  "Who is the CEO?"
];

async function runBenchmark() {
  let totalTokens = 0;
  let managerCalls = 0;
  let specialistCalls = 0;
  let managerTokens = 0;
  let specialistTokens = 0;

  for (const tc of TEST_CASES) {
    console.log(`Running: ${tc}`);
    try {
      const res = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: tc })
      });
      const data = await res.json();
      
      console.log(`Route: ${data.agent}, Tokens: ${data.usage?.totalTokens}`);
      
      totalTokens += data.usage?.totalTokens || 0;
      if (data.agent === 'manager') {
        managerCalls++;
        managerTokens += data.usage?.totalTokens || 0;
      } else {
        specialistCalls++;
        specialistTokens += data.usage?.totalTokens || 0;
      }
    } catch (err) {
      console.error(`Failed on ${tc}`, err);
    }
  }

  console.log('\n--- Benchmark Results ---');
  console.log(`Total questions: ${TEST_CASES.length}`);
  console.log(`Total tokens: ${totalTokens}`);
  console.log(`Avg tokens/question: ${totalTokens / TEST_CASES.length}`);
  console.log(`Manager calls: ${managerCalls} (Avg: ${managerCalls ? managerTokens / managerCalls : 0} tokens)`);
  console.log(`Specialist calls: ${specialistCalls} (Avg: ${specialistCalls ? specialistTokens / specialistCalls : 0} tokens)`);
}

runBenchmark();
