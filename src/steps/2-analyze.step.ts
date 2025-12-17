import { Config, Handlers } from 'motia';

// --- Configuration ---
export const config: Config = {
    // @ts-expect-error: Logic requires name but type definition is missing it
    name: 'analyze-incident',
    type: 'event',
    subscribes: ['incident.detected'],
    emits: ['human.approval.needed'],
    flows: ['opsguard-flow']
};

// --- Handler Logic ---
export const handler: Handlers['analyze-incident'] = async (data: any, context: any) => {
    const { emit, logger, state } = context;

    const { incidentId, issueType } = data;

    logger.info(`🤖 AI ANALYST: Thinking about Incident ${incidentId}...`);


    await new Promise(r => setTimeout(r, 2000));

    // --- AI Logic (Simulated) ---
    let aiAnalysis;

    if (issueType && issueType.includes('RCE')) {

        aiAnalysis = {
            rootCause: "Outdated 'next' dependency contains critical security flaw.",
            riskLevel: "HIGH",
            suggestedFix: "Upgrade 'next' package to version 15.2.1",
            commandToRun: "npm install next@15.2.1",
            confidence: 98
        };
    } else {
        aiAnalysis = {
            rootCause: "Unknown System Anomaly",
            riskLevel: "LOW",
            suggestedFix: "Restart Service",
            commandToRun: "npm start",
            confidence: 60
        };
    }

    logger.info(`💡 SOLUTION FOUND: ${aiAnalysis.suggestedFix}`);
    const existingData = (await state.get('active_incidents', incidentId)) || {};
    await state.set('active_incidents', incidentId, {
        ...existingData,
        status: 'waiting_approval',
        aiAnalysis: aiAnalysis
    });

    logger.info(`⏳ Awaiting Admin Approval for Incident ${incidentId}...`);

    await emit({
        topic: 'human.approval.needed',
        data: { incidentId, analysis: aiAnalysis } as any
    });
};