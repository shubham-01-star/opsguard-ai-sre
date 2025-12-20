# OpsGuard Client SDK 🛡️

The official Node.js **Messenger Client** for **OpsGuard** - The Autonomous AI SRE Agent.

This package acts as a sensor/messenger that forwards errors to your **Central OpsGuard Brain** for autonomous analysis and healing.

[![npm version](https://img.shields.io/npm/v/opsguard-ai-sre.svg)](https://www.npmjs.com/package/opsguard-ai-sre)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📦 Installation

```bash
npm install opsguard-ai-sre
```

## 🚀 Usage

### basic Usage (If Brain has Keys configured)
If your deployed backend already has the API keys in its environment variables, you just need to point to it.

```javascript
import { OpsGuard } from 'opsguard-ai-sre';

const agent = new OpsGuard({
  endpoint: 'https://your-deployed-opsguard.onrender.com', // Your Deployed Brain URL
  serviceName: 'payment-service-prod'
});

try {
  // Your code...
  throw new Error("DB Connection Failed");
} catch (error) {
  agent.captureException(error);
}
```

### 🔐 Advanced: Bring Your Own Key (BYOK)
If you want to provide your own Gemini API Key and Discord Webhook (making the backend stateless for your tenant):

```javascript
const agent = new OpsGuard({
  endpoint: 'https://your-deployed-opsguard.onrender.com',
  serviceName: 'my-startup-app',
  // Pass your own keys securely
  geminiApiKey: process.env.GEMINI_API_KEY,      
  discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL 
});
```

## 🔧 Configuration Options

| Option | Type | Description | Required |
|--------|------|-------------|----------|
| `endpoint` | `string` | URL where OpsGuard Backend is running | ✅ Yes |
| `serviceName` | `string` | Identifier for the service source | ✅ Yes |
| `geminiApiKey` | `string` | Custom Google Gemini API Key (overrides backend default) | ❌ No |
| `discordWebhookUrl` | `string` | Custom Discord Webhook URL (overrides backend default) | ❌ No |

## 🤝 Contributing

This SDK is part of the OpsGuard ecosystem. Issues and Pull Requests are welcome at the [main repository](https://github.com/yourusername/opsguard-ai-sre).

## 📄 License

MIT
