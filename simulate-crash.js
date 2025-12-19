// Native fetch is supported in Node.js v18+

async function simulateCrash() {
    const likelyUrls = [
        'http://localhost:3000/api/ingest-alert',
        'http://localhost:3000/ingest-alert',
        'http://localhost:3000/api/motia/webhook/ingest-alert',
        'http://localhost:3000/api/motia/webhooks/ingest-alert',
        'http://localhost:3000/webhook/ingest-alert',
        'http://localhost:3000/api/v1/ingest-alert'
    ];

    const payload = {
        serverName: "production-svc-01",
        timestamp: new Date().toISOString(),
        errorLogs: `
          [ERROR] 2025-12-17 08:45:12 Critical Process Failure
          [FATAL] Memory usage exceeded 98% (Out of Bounds Exception)
          [Context] Service: payment-gateway
          [Stacktrace] at java.lang.OutOfMemoryError: Java heap space
        `,
        severity: "CRITICAL"
    };

    console.log("🔥 Simulating Server Crash...");

    for (const url of likelyUrls) {
        console.log(`Trying: ${url}`);
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                console.log(`✅ Success! Endpoint found at: ${url}`);
                const data = await response.json();
                console.log("Response:", data);
                return;
            } else {
                console.log(`❌ Failed (${response.status})`);
            }
        } catch (error) {
            console.log(`❌ Error connecting to ${url}: ${error.message}`);
        }
    }
}

simulateCrash();
