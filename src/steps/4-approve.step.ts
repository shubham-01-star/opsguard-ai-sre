import { Config, Handlers } from 'motia';

// --- Configuration ---
export const config: Config = {
  // @ts-expect-error: Logic requires name but type definition is missing it
  name: 'approve-fix',
  type: 'api',
  path: '/approve-fix',
  method: 'GET', // Changed to GET for clickable Discord links
  emits: ['approval.received', 'ticket.escalation'],
  flows: ['opsguard-flow']
};

// --- Handler Logic ---
export const handler: Handlers['approve-fix'] = async (req: any, context: any) => {
  const { emit, logger, state } = context;

  logger.info(`🔍 DEBUG: Request received at /approve-fix`);
  logger.info(`🔍 DEBUG: req.query = ${JSON.stringify(req.query)}`);
  logger.info(`🔍 DEBUG: req.body = ${JSON.stringify(req.body)}`);
  logger.info(`🔍 DEBUG: req.params = ${JSON.stringify(req.params)}`);
  logger.info(`🔍 DEBUG: req.url = ${req.url}`);

  // Supports GET query params for easy clicking
  const incidentId = req.query?.incidentId || req.body?.incidentId;
  const action = req.query?.action; // 'escalate' or undefined (approve)

  if (!incidentId) {
    return { status: 400, body: { error: 'Missing incidentId' } };
  }

  // --- ESCALATION FLOW ---
  if (action === 'escalate') {
    logger.warn(`⚠️ ESCALATION RECEIVED for Incident ${incidentId}`);

    await emit({
      topic: 'ticket.escalation',
      data: { incidentId, reason: "Manual Escalation by Admin", approver: "AdminUser" } as any
    });

    return {
      status: 200,
      body: { message: `🚫 Incident ${incidentId} ESCALATED. Ticket is being created.` }
    };
  }

  // --- APPROVAL FLOW (Default) ---
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
    body: { message: `✅ Fix authorized for ${incidentId}. Executing now...` }
  };
};