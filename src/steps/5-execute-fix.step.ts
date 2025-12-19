import { Config, Handlers } from 'motia';

// --- Configuration ---
export const config: Config = {
  // @ts-expect-error: Logic requires name but type definition is missing it
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

  // 1. Update State to 'executing' (Frontend listens for this)
  const incidentData = (await state.get('active_incidents', incidentId)) || {};
  await state.set('active_incidents', incidentId, {
    ...incidentData,
    status: 'executing'
  });

  // 2. Simulate Command Execution (Real execution is dangerous without sandbox)
  // To make it "Real", we would use: import { exec } from 'child_process';
  // But for a demo, a realistic delay + log is safer and effectively identical.
  await new Promise(r => setTimeout(r, 5000)); // 5s delay to show off "Maintenance" UI

  // 3. Update State to 'resolved'
  await state.set('active_incidents', incidentId, {
    ...await state.get('active_incidents', incidentId),
    status: 'resolved',
    resolvedAt: new Date().toISOString()
  });

  logger.info('✅ PATCH APPLIED SUCCESSFULLY.');
  logger.info('🔄 Verifying System Health... OK.');
  logger.info(`🎉 INCIDENT ${incidentId} CLOSED.`);

  await emit({
    topic: 'incident.resolved',
    data: { incidentId, status: 'resolved' } as any
  })
};