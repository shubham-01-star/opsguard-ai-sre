import type { CronConfig, Handlers } from 'motia';

export const config: CronConfig = {
    name: 'hourly-health-check',
    type: 'cron',
    // Runs every hour at minute 0
    cron: '0 * * * *',
    emits: ['incident.detected'],
    flows: ['opsguard-flow']
};

export const handler: Handlers['hourly-health-check'] = async (context: any) => {
    const { emit, logger } = context;

    logger.info('🛡️ STARTING HOURLY SECURITY SCAN...');
    logger.info('🔍 Checking dependencies against CVE Database...');

    // Simulate Scan Delay
    await new Promise(r => setTimeout(r, 1500));

    // --- Simulation Logic ---
    // In a real app, we would run `npm audit --json` here.
    // We simulate finding a critical vulnerability in 'next' package.
    const vulnerabilityFound = true; // Hardcoded for Demo

    if (vulnerabilityFound) {
        logger.error('❌ CRITICAL VULNERABILITY DETECTED: CVE-2025-9988');
        logger.warn('📦 Package: next@14.1.0');
        logger.warn('⚠️ Risk: Remote Code Execution (RCE)');

        const incidentId = `SEC-${Date.now()}`;

        // Trigger the Main Loop
        await emit({
            topic: 'incident.detected',
            data: {
                incidentId,
                issueType: 'SECURITY_VULNERABILITY',
                serverName: 'Production-Web-01',
                errorLogs: 'Audit Report: Critical RCE in next@14.1.0. Recommendation: Upgrade to 14.2.0 immediately.',
                severity: 'CRITICAL',
                timestamp: new Date().toISOString(),
            } as any
        });

        logger.info(`🚨 Incident ${incidentId} created. Handing over to AI Analyst.`);
    } else {
        logger.info('✅ System Secure. No vulnerabilities found.');
    }
};
