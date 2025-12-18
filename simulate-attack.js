// Use this command to run: node simulate-attack.js
import http from 'http';

// The fake data mimicking a critical security alert
const data = JSON.stringify({
  source: "Security-Scanner",
  severity: "CRITICAL",
  serviceName: "payment-gateway",
  issueType: "RCE Vulnerability (CVE-2025-9821)",
  description: "Critical flaw in Next.js < 15.2",
  timestamp: new Date().toISOString()
});

// Connection options (Targeting Port 4000)
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/webhooks/ingest-alert', // The endpoint we created in Step 1
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
  },
};

console.log("\n💀  INITIATING ATTACK ON PORT 4000...");

// Sending the request
const req = http.request(options, (res) => {
  res.on('data', (d) => process.stdout.write(d));
  res.on('end', () => console.log("\n\n✅ Alert Sent! Check Motia Terminal."));
});

req.on('error', (e) => console.error(`❌ Failed: ${e.message}`));

// Write data and close connection
req.write(data);
req.end();