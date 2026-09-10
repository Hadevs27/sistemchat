 // or global fetch in node 18+

const tests = [
  { name: '1. General question', query: 'What is Next.js?' },
  { name: '2. Document question', query: 'How many annual leave days do we get?' },
  { name: '3. Paraphrased document question', query: 'Can you tell me about the procedure to approve inspections?' },
  { name: '4. Information not in document', query: 'Who is the CEO of the company?' },
];

async function run() {
  console.log('--- STARTING TESTS ---');
  let totalTokensAll = 0;
  
  for (const t of tests) {
    console.log(`\nTest: ${t.name}`);
    console.log(`Query: ${t.query}`);
    
    try {
      const res = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: t.query })
      });
      
      const data = await res.json();
      if (res.ok) {
        console.log(`Agent: ${data.agent}`);
        console.log(`Answer: ${data.message.trim()}`);
        console.log(`Usage: Input ${data.usage?.inputTokens}, Output ${data.usage?.outputTokens}, Total ${data.usage?.totalTokens}`);
        totalTokensAll += data.usage?.totalTokens || 0;
      } else {
        console.log(`Error:`, data);
      }
    } catch (e) {
      console.log(`Failed to fetch:`, e.message);
    }
  }
  
  console.log(`\n--- ALL TESTS COMPLETED ---`);
  console.log(`Total Tokens Used in Benchmark: ${totalTokensAll}`);
}

run();
