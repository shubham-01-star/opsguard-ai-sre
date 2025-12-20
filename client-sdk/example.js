
const { OpsGuard } = require('./dist/index.js');

// 1. Initialize the Agent
const agent = new OpsGuard({
    endpoint: 'http://localhost:3000', // Replace with your Deployed URL
    serviceName: 'my-production-app'
});

// 2. Simulate an Error
try {
    throw new Error("Database Connection Failed: Timeout (5000ms)");
} catch (err) {
    // 3. Send to OpsGuard
    agent.captureException(err);
}
