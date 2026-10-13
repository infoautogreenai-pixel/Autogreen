/**
 * Standalone seed trigger script
 */
const http = require('http');

console.log('Triggering seed via http://localhost:3000/api/seed ...');

http.get('http://localhost:3000/api/seed', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Seed Response:', json);
    } catch {
      console.log('Raw Response:', data);
    }
  });
}).on('error', (err) => {
  console.error('Error triggering seed. Make sure "npm run dev" is running:', err.message);
});
