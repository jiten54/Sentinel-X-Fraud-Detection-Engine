import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Transaction {
  id: string;
  timestamp: number;
  amount: number;
  merchant: string;
  location: string;
  userId: string;
  deviceType: string;
  isFraud?: boolean;
  score: number;
  features: {
    txCountLastHour: number;
    avgAmountLast24h: number;
    distanceFromHome: number;
    isInternational: boolean;
  };
}

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-memory data store for the live session
let transactions: Transaction[] = [];
const MAX_HISTORY = 1000;

// Simple Inference Logic (Simulated Random Forest)
function scoreTransaction(tx: Partial<Transaction>): number {
  let score = 0;
  if (!tx.features) return 0;

  // Weightings based on common fraud patterns
  if (tx.amount && tx.amount > 1000) score += 0.3;
  if (tx.features.txCountLastHour > 5) score += 0.4;
  if (tx.features.distanceFromHome > 200) score += 0.2;
  if (tx.features.isInternational) score += 0.1;
  
  // Add some randomness/complexity
  return Math.min(score + Math.random() * 0.1, 1);
}

// Routes
app.get("/api/transactions", (req, res) => {
  res.json(transactions.slice(-100).reverse());
});

app.get("/api/stats", (req, res) => {
  const lastHour = transactions.filter(t => t.timestamp > Date.now() - 3600000);
  const fraudCount = lastHour.filter(t => t.isFraud).length;
  const totalVolume = lastHour.reduce((sum, t) => sum + t.amount, 0);
  
  res.json({
    totalProcessed: transactions.length,
    lastHourCount: lastHour.length,
    fraudAlerts: fraudCount,
    volume: totalVolume.toFixed(2),
    health: "Operational"
  });
});

// Real-time Stream via SSE
app.get("/api/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const interval = setInterval(() => {
    const merchants = ["Amazon", "Uber", "Apple", "Walmart", "Unknown Vendor", "Casino Royale", "Tech Gadgets"];
    const locations = ["New York, NY", "London, UK", "Paris, FR", "Moscow, RU", "Tokyo, JP", "Bermuda"];
    const devices = ["iPhone 15", "Web Dashboard", "Android Pay", "Unknown POS"];
    
    const isSuspiciousAmount = Math.random() > 0.95;
    const amount = isSuspiciousAmount ? 500 + Math.random() * 5000 : 5 + Math.random() * 200;
    
    // Feature Engineering Simulation
    const tx: Transaction = {
      id: Math.random().toString(36).substring(2, 11),
      timestamp: Date.now(),
      amount: parseFloat(amount.toFixed(2)),
      merchant: merchants[Math.floor(Math.random() * merchants.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      userId: `user_${Math.floor(Math.random() * 100)}`,
      deviceType: devices[Math.floor(Math.random() * devices.length)],
      features: {
        txCountLastHour: Math.floor(Math.random() * 10),
        avgAmountLast24h: 150,
        distanceFromHome: Math.floor(Math.random() * 1000),
        isInternational: Math.random() > 0.8
      },
      score: 0
    };

    tx.score = scoreTransaction(tx);
    tx.isFraud = tx.score > 0.7;

    transactions.push(tx);
    if (transactions.length > MAX_HISTORY) transactions.shift();

    res.write(`data: ${JSON.stringify(tx)}\n\n`);
  }, 1500);

  req.on("close", () => clearInterval(interval));
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Fraud Detection System running on http://localhost:${PORT}`);
  });
}

startServer();
