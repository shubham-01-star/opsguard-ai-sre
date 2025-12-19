import { Config, Handlers } from 'motia';

// --- Configuration ---
export const config: Config = {
  // @ts-expect-error: Logic requires name but type definition is missing it
  name: 'approve-fix',
  type: 'api',
  path: '/approve-fix',
  method: 'POST',
  emits: ['approval.received'],
  flows: ['opsguard-flow']
};

// --- Handler Logic ---
export const handler: Handlers['approve-fix'] = async (req: any, context: any) => {
  const { emit, logger, state } = context;

  // Discord might send payload in body. We expect { incidentId } 
  // For simplicity, let's assume we pass ?incidentId=... or body { incidentId }
  const incidentId = req.body?.incidentId || req.query?.incidentId;

  if (!incidentId) {
    return { status: 400, body: { error: 'Missing incidentId' } };
  }

  logger.info(`👍 APPROVAL RECEIVED for Incident ${incidentId} via Webhook.`);

  // Retrieve analysis to get the command
  const incidentData = (await state.get('active_incidents', incidentId)) || {};
  const fixCommand = incidentData.aiAnalysis?.commandToRun || "echo 'No command found'";

  await emit({
    topic: 'approval.received',
    data: { incidentId, fixCommand } as any
  });

  return {
    status: 200,
    body: { message: `Fix authorized for ${incidentId}. Executing now...` }
  };
};