import xgboost as xgb
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import precision_recall_fscore_support, roc_auc_score
import joblib

class FraudModel:
    def __init__(self, model_type='xgboost'):
        self.model_type = model_type
        if model_type == 'xgboost':
            self.model = xgb.XGBClassifier(
                n_estimators=100,
                max_depth=6,
                learning_rate=0.1,
                scale_pos_weight=10, # Handle class imbalance
                use_label_encoder=False,
                eval_metric='logloss'
            )
        else:
            self.model = RandomForestClassifier(n_estimators=100, class_weight='balanced')
            
    def train(self, X_train, y_train):
        print(f"Training {self.model_type} model...")
        self.model.fit(X_train, y_train)
        
    def evaluate(self, X_test, y_test):
        y_pred = self.model.predict(X_test)
        y_prob = self.model.predict_proba(X_test)[:, 1]
        
        precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='binary')
        auc = roc_auc_score(y_test, y_prob)
        
        return {
            "precision": precision,
            "recall": recall,
            "f1_score": f1,
            "roc_auc": auc
        }
    
    def save(self, path):
        joblib.dump(self.model, path)
        print(f"Model saved to {path}")

    def load(self, path):
        self.model = joblib.load(path)
