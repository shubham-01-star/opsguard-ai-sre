
export interface OpsGuardConfig {
    /**
     * The URL of your deployed OpsGuard instance
     * e.g., "https://opsguard-ai-sre.up.railway.app/"
     */
    endpoint: string;

    /**
     * Name of the service sending alerts
     * e.g., "payment-service-prod"
     */
    serviceName: string;

    /**
     * (Optional) Your Google Gemini API Key for AI Analysis
     */
    geminiApiKey?: string;

    /**
     * (Optional) Your Discord Webhook URL for notifications
     */
    discordWebhookUrl?: string;
}

export class OpsGuard {
    private config: OpsGuardConfig;

    constructor(config: OpsGuardConfig) {
        this.config = config;
    }

    /**
     * Captures an error and sends it to OpsGuard for analysis
     * @param error The error object or message
     * @param meta Additional context (optional)
     */
    async captureException(error: Error | string | unknown, meta?: Record<string, any>) {
        const errorMsg = error instanceof Error ? error.stack || error.message : String(error);

        console.log('[OpsGuard-SDK] Sending alert to brain...');

        try {
            const response = await fetch(`${this.config.endpoint}/ingest-alert`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serverName: this.config.serviceName,
                    errorLogs: errorMsg,
                    severity: 'CRITICAL',
                    timestamp: new Date().toISOString(),
                    geminiApiKey: this.config.geminiApiKey,
                    discordWebhookUrl: this.config.discordWebhookUrl,
                    ...meta
                })
            });

            if (!response.ok) {
                console.error(`[OpsGuard-SDK] Failed to send alert: ${response.statusText}`);
                return;
            }

            const data = await response.json();
            console.log(`[OpsGuard-SDK] Alert Sent! ID: ${data.incidentId}`);
            return data;

        } catch (err) {
            console.error('[OpsGuard-SDK] Network error sending alert:', err);
        }
    }
}
