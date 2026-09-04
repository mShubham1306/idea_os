"""
Train ML Model for Startup Success Prediction
Uses dataset/big_startup_secsees_dataset.csv (66,368 real startups)
Trains a calibrated classifier to predict startup outcome probability and extracts sector benchmarks.
"""
import os
import re
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import roc_auc_score, accuracy_score

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, '..', 'dataset', 'big_startup_secsees_dataset.csv')
OUTPUT_DIR = os.path.join(BASE_DIR, 'data')
MODEL_PATH = os.path.join(OUTPUT_DIR, 'startup_ml_model.joblib')


def clean_text(text):
    if not isinstance(text, str):
        return ''
    text = text.replace('|', ' ').replace('-', ' ').replace('/', ' ')
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
    return ' '.join(text.lower().split())


def train_and_save():
    print(f'Loading dataset from: {DATASET_PATH}')
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f'Dataset not found at {DATASET_PATH}')

    df = pd.read_csv(DATASET_PATH)
    print(f'Total rows loaded: {len(df)}')

    df['category_clean'] = df['category_list'].apply(clean_text)
    df['name_clean'] = df['name'].fillna('').astype(str)
    df['funding_numeric'] = pd.to_numeric(df['funding_total_usd'], errors='coerce').fillna(0)
    df['rounds_numeric'] = pd.to_numeric(df['funding_rounds'], errors='coerce').fillna(1)
    df['status_clean'] = df['status'].fillna('operating').astype(str).str.lower()

    df['target'] = np.where(
        df['status_clean'].isin(['acquired', 'ipo']) |
        ((df['status_clean'] == 'operating') & (df['funding_numeric'] >= 500000)),
        1,
        0
    )

    print('Computing sector benchmarks & comparables...')
    sector_stats = {}
    df['primary_cat'] = df['category_clean'].apply(lambda x: x.split()[0] if x else 'general')
    
    grouped = df.groupby('primary_cat')
    for cat, group in grouped:
        if len(group) >= 15:
            funded = group[group['funding_numeric'] > 0]['funding_numeric']
            med_fund = float(funded.median()) if len(funded) > 0 else 250000.0
            p25_fund = float(funded.quantile(0.25)) if len(funded) > 0 else 50000.0
            p75_fund = float(funded.quantile(0.75)) if len(funded) > 0 else 2000000.0
            p90_fund = float(funded.quantile(0.90)) if len(funded) > 0 else 10000000.0
            
            success_examples = group[group['target'] == 1][['name', 'funding_numeric', 'status']].head(3).to_dict(orient='records')
            risk_examples = group[group['status_clean'] == 'closed'][['name', 'funding_numeric', 'status']].head(2).to_dict(orient='records')
            
            sector_stats[cat] = {
                'count': int(len(group)),
                'success_rate': round(float(group['target'].mean() * 100), 1),
                'median_funding': med_fund,
                'p25_funding': p25_fund,
                'p75_funding': p75_fund,
                'p90_funding': p90_fund,
                'success_examples': success_examples,
                'risk_examples': risk_examples,
            }

    all_funded = df[df['funding_numeric'] > 0]['funding_numeric']
    global_stats = {
        'total_startups': len(df),
        'global_success_rate': round(float(df['target'].mean() * 100), 1),
        'global_median_funding': float(all_funded.median()),
        'global_p25_funding': float(all_funded.quantile(0.25)),
        'global_p75_funding': float(all_funded.quantile(0.75)),
        'global_p90_funding': float(all_funded.quantile(0.90)),
        'total_sectors': len(sector_stats),
    }

    print('Fitting TF-IDF Vectorizer...')
    tfidf = TfidfVectorizer(max_features=500, ngram_range=(1, 2), stop_words='english')
    X_text = tfidf.fit_transform(df['category_clean']).toarray()
    
    X_features = np.hstack([
        X_text,
        df[['rounds_numeric']].values
    ])
    y = df['target'].values

    X_train, X_test, y_train, y_test = train_test_split(
        X_features, y, test_size=0.15, random_state=42, stratify=y
    )

    print('Training HistGradientBoostingClassifier...')
    clf = HistGradientBoostingClassifier(
        max_iter=120,
        learning_rate=0.08,
        max_leaf_nodes=31,
        min_samples_leaf=20,
        random_state=42
    )
    clf.fit(X_train, y_train)

    y_pred_proba = clf.predict_proba(X_test)[:, 1]
    auc = roc_auc_score(y_test, y_pred_proba)
    acc = accuracy_score(y_test, (y_pred_proba >= 0.5).astype(int))

    print(f'Validation Accuracy: {acc * 100:.2f}% | ROC-AUC: {auc:.4f}')

    model_bundle = {
        'model': clf,
        'tfidf': tfidf,
        'feature_count': X_features.shape[1],
        'sector_stats': sector_stats,
        'global_stats': global_stats,
        'metrics': {
            'accuracy': round(float(acc * 100), 2),
            'roc_auc': round(float(auc), 4),
            'training_samples': int(len(X_train)),
            'test_samples': int(len(X_test)),
        }
    }

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    joblib.dump(model_bundle, MODEL_PATH, compress=3)
    print(f'Model saved to: {MODEL_PATH} ({os.path.getsize(MODEL_PATH) / 1024:.1f} KB)')

if __name__ == '__main__':
    train_and_save()