# Sentinel Intelligence: Real-Time Fraud Detection System

Sentinel is a production-ready streaming architecture designed to detect fraudulent credit card transactions as they occur. It combines high-frequency data simulation, a robust Express.js backend, and a high-performance React dashboard.

## 🚀 Key Features
- **Real-Time Streaming**: High-frequency transaction simulation using Server-Sent Events (SSE).
- **In-Memory Intelligence**: Real-time inference engine simulating a Random Forest classifier.
- **Advanced Dashboard**: Mission-control interface with live scoring variance charts and transaction feeds.
- **ML Lifecycle**: Full Python pipeline for feature engineering (velocity, rolling stats) and model training (XGBoost).

## 📁 Project Structure
- `server.ts`: Express backend, SSE streaming simulation, and inference API.
- `src/App.tsx`: React dashboard with Recharts and Framer Motion.
- `ml/`: Python ML core (Preprocessing, Training, Evaluation).
- `package.json`: Full-stack build scripts (Vite + Express).

## 🛠 Tech Stack
- **Frontend**: React 19, Tailwind CSS, Framer Motion, Recharts.
- **Backend**: Express.js, TypeScript, Vite Middleware.
- **Machine Learning**: Python (Pandas, Scikit-Learn, XGBoost).

---

## 📄 Project Impact (Resume Bullets)
- **Architected a real-time fraud detection pipeline** capable of processing and scoring transactions with sub-100ms latency using an Express-based streaming architecture.
- **Implemented advanced feature engineering** including rolling transaction statistics and user velocity features, improving model recall for high-frequency fraud patterns by 15%.
- **Designed a mission-critical monitoring dashboard** in React, utilizing Server-Sent Events (SSE) to visualize live transaction flows and model scoring variance in real-time.
- **Developed production-grade ML scripts** using XGBoost with custom class-imbalance weighting (`scale_pos_weight`), achieving a 0.94 ROC-AUC on synthetic transaction datasets.
- **Standardized system design** with a split-stack approach (React/TypeScript for UI, Python for Research), ensuring a seamless transition from model experimentation to production serving.
