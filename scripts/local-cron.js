// ============================================================
// Local Cron Script — pings cron API routes every 60 seconds
// Usage: node scripts/local-cron.js
// ============================================================

const CRON_SECRET = process.env.CRON_SECRET || "your-cron-secret-here-change-this";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const endpoints = [
  { name: "Publish Scheduled", url: `${BASE_URL}/api/cron/publish-scheduled` },
  { name: "Expire Ads", url: `${BASE_URL}/api/cron/expire-ads` },
];

async function pingEndpoints() {
  const now = new Date().toLocaleTimeString();
  console.log(`\n⏰ [${now}] Running cron jobs...`);

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint.url, {
        method: "GET",
        headers: {
          "x-cron-secret": CRON_SECRET,
        },
      });
      const data = await res.json();
      const status = res.ok ? "✅" : "❌";
      console.log(`  ${status} ${endpoint.name}: ${JSON.stringify(data)}`);
    } catch (err) {
      console.log(`  ❌ ${endpoint.name}: ${err.message}`);
    }
  }
}

console.log("🔄 AdFlow Pro — Local Cron Runner");
console.log(`   Base URL: ${BASE_URL}`);
console.log(`   Interval: 60 seconds`);
console.log("   Press Ctrl+C to stop\n");

// Run immediately, then every 60 seconds
pingEndpoints();
setInterval(pingEndpoints, 60_000);
