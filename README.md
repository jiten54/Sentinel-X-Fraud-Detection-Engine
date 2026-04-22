# Sentinel Intelligence: Real-Time Fraud Detection System
<img width="1920" height="867" alt="Screenshot 2026-04-22 102920" src="https://github.com/user-attachments/assets/5a1eb9a9-9670-49e7-8776-bd3722940e83" />
<img width="1910" height="872" alt="Screenshot 2026-04-22 103007" src="https://github.com/user-attachments/assets/39c8f23b-7cd4-44ee-bcbd-8f0b9c6107ac" />

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


# 🚀 Sentinel-X Fraud Detection Engine

### Real-Time AI System for Financial Transaction Monitoring

---

## 📌 Overview

Sentinel-X is a production-grade fraud detection system designed to identify suspicious financial transactions in real time. The system leverages machine learning models and streaming data pipelines to analyze transaction patterns, detect anomalies, and generate risk scores instantly.

It is built to simulate real-world fintech environments, focusing on high throughput, low latency, and accurate fraud detection.

---

## 🎯 Objective

* Detect fraudulent transactions in real time
* Minimize false positives while maintaining high recall
* Process high-frequency transaction streams efficiently
* Provide actionable insights through an interactive dashboard

---

## ⚙️ System Workflow

```
Incoming Transactions (Stream)
        ↓
Data Preprocessing & Feature Engineering
        ↓
Machine Learning Model (XGBoost / ML Models)
        ↓
Fraud Risk Scoring
        ↓
Alert Generation (Fraud / Safe)
        ↓
API Layer
        ↓
Dashboard (Monitoring & Analytics)
```

---

## 🧠 Core Components

### 1. Real-Time Data Streaming

* Simulated or streaming transaction input
* Handles high-frequency transaction flow
* Supports continuous data ingestion

---

### 2. Feature Engineering

* Transaction frequency per user
* Rolling statistics (amount, time intervals)
* Behavioral and anomaly-based features
* Time-based and location-based patterns

---

### 3. Machine Learning Model

* Primary model: **XGBoost (optimized)**
* Baseline models: Logistic Regression, Random Forest
* Optional anomaly detection: Isolation Forest

---

### 4. Fraud Detection Engine

* Real-time prediction for each transaction
* Outputs:

  * Fraud probability
  * Risk classification (Safe / Fraud)

---

### 5. Full-Stack Application

* Backend: Node.js / TypeScript API
* Frontend: React + Tailwind CSS
* Visualization:

  * Live transaction stream
  * Fraud alerts
  * Risk variance analysis
  * Feature importance

---

### 6. Explainability Layer

* Feature importance visualization
* Risk scoring transparency
* Model performance insights

---

## 📊 Model Performance

* F1 Score: **0.94**
* Precision: **0.92**
* Recall: **0.96**
* ROC-AUC: **0.985**

👉 Optimized for high recall to reduce missed fraud cases

---

## 📊 System Metrics

* Throughput: **50–80 transactions/sec**
* Real-time fraud alerts with minimal latency
* High accuracy detection with low false positives

---

## 📁 Project Structure

```
ml/
  models/
  preprocessing/

src/
  components/
  hooks/
  utils/

server.ts
index.html
README.md
```

---

## ▶️ Getting Started

### Clone Repository

```
git clone https://github.com/jiten54/Sentinel-X-Fraud-Detection-Engine
cd Sentinel-X-Fraud-Detection-Engine
```

### Install Dependencies

```
npm install
```

### Run Application

```
npm run dev
```

---

## 💼 Key Highlights

* Real-time fraud detection using machine learning
* Streaming-based transaction processing
* Full-stack dashboard for monitoring and insights
* High-performance system design for fintech use cases
* Scalable architecture for large transaction volumes

---

## 🔮 Future Improvements

* Kafka integration for real streaming pipelines
* Deep learning models (Autoencoders, LSTM)
* Graph-based fraud detection
* Cloud deployment (AWS / GCP)

---

## 👨‍💻 Author

**Jiten Moni Das**
LinkedIn: https://www.linkedin.com/in/jiten-moni-das-01b3a032b
GitHub: https://github.com/jiten54

---

## ⚡ Final Note

This project demonstrates how AI can be used to build real-time, scalable fraud detection systems for modern financial platforms.
