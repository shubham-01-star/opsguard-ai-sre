import { Handlers } from 'motia';

// --- Configuration ---
export const config = {
  name: 'execute-fix',
  type: 'event',
  subscribes: ['approval.received'],
  emits: ['incident.resolved'],
  flows: ['opsguard-flow']
};

// --- Handler Logic ---
export const handler: Handlers['execute-fix'] = async (data: any, context: any) => {
  const { emit, logger, state } = context;
  const { incidentId, fixCommand } = data;

  logger.info(`⚙️ EXECUTING FIX for ${incidentId}...`);
  logger.warn(`> Running Command: ${fixCommand}`);

    // Simulate Command Execution Delay
  await new Promise(r => setTimeout(r, 3000));

  logger.info('✅ PATCH APPLIED SUCCESSFULLY.');
  logger.info('🔄 Verifying System Health... OK.');

  // State Update (Resolved)
  const incident = (await state.get('active_incidents', incidentId)) || {};
  await state.set('active_incidents', incidentId, {
    ...incident,
    status: 'resolved',
    resolvedAt: new Date().toISOString()
  });

  logger.info(`🎉 INCIDENT ${incidentId} CLOSED.`);

  await emit({
    topic: 'incident.resolved',
    data: { incidentId, status: 'resolved' } as any
  })
};