import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder

class FraudPreprocessor:
    def __init__(self):
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.categorical_cols = ['merchant', 'location', 'device_type']
        
    def engineer_features(self, df):
        """
        Derives real-time features like velocity and rolling averages.
        """
        # Time-based features
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df['hour'] = df['timestamp'].dt.hour
        df['day_of_week'] = df['timestamp'].dt.dayofweek
        
        # Velocity Features (Transaction count per user in last hour)
        df = df.sort_values(['user_id', 'timestamp'])
        df['tx_count_1h'] = df.groupby('user_id')['amount'].rolling('1H', on='timestamp').count().values
        
        # Amount divergence (current amount vs user's avg)
        df['avg_amount_24h'] = df.groupby('user_id')['amount'].transform(lambda x: x.rolling(window=24, min_periods=1).mean())
        df['amount_ratio'] = df['amount'] / (df['avg_amount_24h'] + 1e-9)
        
        # Distance-based anomalies (simplified)
        df['is_high_amount'] = (df['amount'] > 1000).astype(int)
        
        return df

    def fit_transform(self, df):
        df = self.engineer_features(df)
        
        for col in self.categorical_cols:
            self.label_encoders[col] = LabelEncoder()
            df[col] = self.label_encoders[col].fit_transform(df[col].astype(str))
            
        # Select numeric features for scaling
        numeric_cols = ['amount', 'hour', 'day_of_week', 'tx_count_1h', 'amount_ratio']
        df[numeric_cols] = self.scaler.fit_transform(df[numeric_cols])
        
        return df

    def transform(self, df):
        # Implementation for single record inference
        pass
