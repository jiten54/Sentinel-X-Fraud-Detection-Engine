# Sentinel ML Pipeline

This directory contains the production-grade Python scripts for the Fraud Detection System.

## Contents
- `preprocessing.py`: Feature engineering pipeline including velocity and rolling statistics.
- `model.py`: XGBoost and Random Forest implementations with class imbalance handling.
- `train.py`: Training script template.

## Requirements
```bash
pip install pandas scikit-learn xgboost joblib
```

## Production Flow
1. **Batch Training**: Run weekly on historical transaction data from Snowflake/Redshift.
2. **Feature Store**: Precomputed features (like `avg_amount_24h`) should be served from a low-latency store (Redis/DynamoDB).
3. **Model Serving**: Exported model (`.joblib` or `.json`) served via FastAPI or integrated into the streaming consumer.
