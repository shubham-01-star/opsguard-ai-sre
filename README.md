🛡️ OpsGuard – Autonomous SRE Backend

OpsGuard is an AI-powered SRE (Site Reliability Engineer) backend that helps handle production incidents in a safe and controlled way.

Instead of only sending alerts, OpsGuard:

Reads error logs

Understands what went wrong using AI

Suggests a fix

Waits for human approval before doing anything risky

The goal is simple:
👉 reduce downtime and stress during incidents, without removing human control.

🚀 What OpsGuard Does

Detects incidents from external alerts or logs

Analyzes root cause using Generative AI

Pauses and asks a human to approve the fix

Executes the fix only after approval

Supports escalation when a fix is not safe

Keeps a clear audit trail of all actions

🧠 How It Works (High Level)

OpsGuard backend is built using an event-driven workflow.

Each part of the incident lifecycle is handled as a separate step:

Ingest → Analyze → Approve → Execute → Resolve

Because of this design, the system is:

Easy to pause and resume

Safe by default

Easy to extend

🔄 Incident Lifecycle

Every incident follows this flow:

DETECTED
  ↓
WAITING_FOR_APPROVAL
  ↓
EXECUTING_FIX
  ↓
RESOLVED   or   ESCALATED


⚠️ No fix is applied without explicit human approval.

🧩 Backend Steps Overview

All backend logic lives inside src/steps/:

Step	Purpose
1-ingest-alert	Receives alerts via API (POST /ingest-alert)
2-analyze	Uses AI to analyze logs and suggest a fix
3-wait-for-approval	Sends notification and pauses workflow
4-approve	Handles human decision (Approve / Escalate)
5-execute-fix	Executes approved fix (safe / simulated)
6-hourly-health-check	Runs scheduled checks for issues or CVEs
7-create-ticket	Handles escalation (Jira/Linear – simulated)
8-log-resolution	Closes the incident and stores audit info
🛠️ Tech Stack

Motia Framework – Event-driven workflow orchestration

Node.js + TypeScript – Backend runtime

Google Gemini – AI-based log analysis (with fallback)

Discord Webhooks – Human approval notifications

🔐 Safety First Design

OpsGuard is built with safety in mind:

No blind auto-fixes

Human approval is mandatory

AI failures fall back to manual review

Every action is logged for auditing

🔌 API Usage (Quick Example)
Trigger an Incident
curl -X POST http://localhost:3000/ingest-alert \
  -H "Content-Type: application/json" \
  -d '{
    "serverName": "prod-api-01",
    "errorLogs": "JavaScript heap out of memory"
  }'

Approve or Escalate
# Approve fix
curl "http://localhost:3000/approve-fix?incidentId=INC-123456"

# Escalate incident
curl "http://localhost:3000/approve-fix?incidentId=INC-123456&action=escalate"

📦 npm Package

OpsGuard also provides a lightweight npm package that can be installed in any Node.js or Next.js application to send errors to this backend.

👉 https://www.npmjs.com/package/opsguard

🎥 Dashboard Note

The dashboard shown in demos is only a simulation layer to explain the workflow visually.

In real deployments:

OpsGuard works without a UI

Interaction happens via logs, events, and approvals (e.g. Discord)

📈 Current Status

✅ Core backend workflow complete

✅ Human-in-the-loop approval

✅ Discord notifications

✅ AI analysis with fallback

✅ Proactive health checks

✅ npm package integration ready

🧭 Future Improvements

Real Jira / Linear integration

Hardened remediation execution

Multi-incident support

SaaS-hosted backend

👤 Author

Shubham