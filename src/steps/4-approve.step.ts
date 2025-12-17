import { Handlers } from 'motia';

// --- Configuration ---
export const config = {
  name: 'approve-fix',
  type: 'api',
  path: '/webhooks/approve-fix',
  method: 'POST',
  emits: ['approval.received', 'ticket.escalation'], // Approval (fix) or Escalation (ticket)
  flows: ['opsguard-flow'],
  virtualSubscribes: ['manual.intervention']
};

// --- Handler Logic ---
export const handler: Handlers['approve-fix'] = async (req: any, context: any) => {
  const { emit, logger, state } = context;


  const { incidentId, approver, action } = req.body || {};

 
  const incident = (await state.get('active_incidents', incidentId)) || {};

  if (!incident || !incident.status) {
    logger.error(`❌ Action Failed: Incident ${incidentId} not found.`);
    return { status: 404, body: { error: 'Incident not found' } };
  }

  // --- HANDLE ESCALATION ---
  if (action === 'escalate') {
    logger.warn(`⚠️ ESCALATION RECEIVED for ${incidentId} by ${approver || 'Admin'}`);

    await emit({
      topic: 'ticket.escalation',
      data: {
        incidentId,
        approver: approver || 'Admin',
        reason: 'Manual escalation by admin (Fix rejected)'
      } as any
    });

    return {
      status: 200,
      body: { message: 'Escalation triggered. Ticket creation in progress.' }
    };
  }

  // --- HANDLE APPROVAL (Default) ---
  logger.info(`👍 APPROVAL RECEIVED for ${incidentId} by ${approver || 'Admin'}`);

  // 3. State Update (Status -> Approved)
  await state.set('active_incidents', incidentId, {
    ...incident,
    status: 'approved',
    approvedBy: approver || 'Admin',
    approvedAt: new Date().toISOString()
  });


  await emit({
    topic: 'approval.received',
    data: {
      incidentId,
      fixCommand: incident.aiAnalysis?.commandToRun || 'echo "Default Fix"'
    } as any
  });
  return {
    status: 200,
    body: { message: 'Approval Accepted. Initiating Auto-Fix Sequence...' }
  };
};