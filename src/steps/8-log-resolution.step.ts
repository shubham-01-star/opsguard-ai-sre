import { Handlers } from 'motia';

// --- Configuration ---
export const config = {
    name: 'log-resolution',
    type: 'event',
    subscribes: ['incident.resolved'],
    emits: [],
    flows: ['opsguard-flow']
};

// --- Handler Logic ---
export const handler: Handlers['log-resolution'] = async (data: any, context: any) => {
    const { logger } = context;
    const { incidentId } = data;

    logger.info(`🏁 END OF WORKFLOW for Incident ${incidentId}`);
    logger.info('📂 Incident archived to historical database.');
    logger.info('✨ System Status: OPERATIONAL');
};
