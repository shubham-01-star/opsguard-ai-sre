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
    const { incidentId, errorLogs } = data;

    logger.info(`🤖 AI ANALYST: Thinking about Incident ${incidentId}...`);

    // --- Real AI Logic (Gemini) ---
    let aiAnalysis;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        logger.warn("⚠️ No GEMINI_API_KEY found. Falling back to simulation.");
        // Fallback simulation
        aiAnalysis = {
            rootCause: "Simulated: Memory Leak in Service",
            riskLevel: "MEDIUM",
            suggestedFix: "Restart Service",
            commandToRun: "docker restart payment-gateway",
            confidence: 50
        };
    } else {
        try {
            const prompt = `
            You are an expert SRE (Site Reliability Engineer).
            Analyze these error logs and identify the root cause, risk level, and a specific fix command.
            
            Logs:
            ${errorLogs}

            Respond ONLY in JSON format like this:
            {
                "rootCause": "Short explanation of the issue",
                "riskLevel": "HIGH" | "MEDIUM" | "LOW",
                "suggestedFix": "Human readable fix action",
                "commandToRun": "Actual command to execute (e.g., docker restart, kubectl scale, npm install)",
                "confidence": number (0-100)
            }
            `;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

            // Clean up JSON markdown if present
            const jsonText = text?.replace(/```json/g, '').replace(/```/g, '').trim();
            aiAnalysis = JSON.parse(jsonText);
            logger.info("🧠 Gemini Analysis Complete");

        } catch (error) {
            logger.error("❌ Gemini API Failed", error);
            aiAnalysis = {
                rootCause: "AI Analysis Failed",
                riskLevel: "UNKNOWN",
                suggestedFix: "Manual Investigation Required",
                commandToRun: "echo 'Check Logs Manually'",
                confidence: 0
            };
        }
    }

    logger.info(`💡 SOLUTION FOUND: ${aiAnalysis.suggestedFix}`);

    // Persist Analysis
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