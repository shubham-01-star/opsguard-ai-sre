import fetch from 'node-fetch';

async function approveFix() {
    // We need the incident ID. In a real app, this comes from the Dashboard/Slack link.
    // For simulation, we'll fetch the current state or just use a hardcoded/latest one if possible.
    // Ideally, we'd paste it from the logs, but let's try to query Motia state or just ask the user to input it.
    // For now, let's look for the latest incident ID by querying the flow trace or state... 
    // actually, let's just make it accept an argument or default to a placeholder we can paste.

    const incidentId = process.argv[2];

    if (!incidentId) {
        console.error("❌ Usage: node approve-fix.js <INCIDENT_ID>");
        process.exit(1);
    }

    const approvalUrl = 'http://localhost:3000/webhooks/approve-fix';

    const payload = {
        incidentId: incidentId,
        approver: "Senior_SRE_User"
    };

    console.log(`👍 Approving Incident: ${incidentId}...`);

    try {
        const response = await fetch(approvalUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            console.log("✅ Approved Successfully!");
            const data = await response.json();
            console.log("Response:", data);
        } else {
            console.error("❌ Approval Failed:", response.status);
            console.log(await response.text());
        }
    } catch (error) {
        console.error("❌ Network Error:", error.message);
    }
}

approveFix();
