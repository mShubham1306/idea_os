import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const [cleared, setCleared] = useState(false);

  const handleClear = () => {
    localStorage.removeItem('ideaos_active_idea');
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  };

  return (
    <motion.div
      className="settings-page"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ paddingBottom: '3rem' }}
    >
      <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc', margin: '0 0 0.4rem 0' }}>
          ⚙️ System & AI Settings
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
          Manage Gemini API configuration, machine learning weights, and database synchronization.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Gemini API Status Card */}
        <div style={{ background: 'rgba(15, 23, 42, 0.85)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
              🤖 Google Gemini AI Engine
            </h3>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700' }}>
              Connected & Active
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Default Model:</span>
              <span style={{ color: '#06b6d4', fontWeight: '600' }}>gemini-3.6-flash</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>API Key Status:</span>
              <span style={{ color: '#10b981', fontWeight: '600' }}>Configured in backend/.env</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Supported Roles:</span>
              <span style={{ color: '#cbd5e1' }}>Idea Expansion, Deep JSON, Audit, Copilot</span>
            </div>
          </div>
        </div>

        {/* Machine Learning Model Card */}
        <div style={{ background: 'rgba(15, 23, 42, 0.85)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
              📈 Scikit-Learn ML Model
            </h3>
            <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#38bdf8', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700' }}>
              Loaded (66k Dataset)
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Algorithm:</span>
              <span style={{ color: '#38bdf8', fontWeight: '600' }}>HistGradientBoostingClassifier</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Dataset Samples:</span>
              <span style={{ color: '#f8fafc', fontWeight: '600' }}>66,368 Startups</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Validation ROC-AUC:</span>
              <span style={{ color: '#10b981', fontWeight: '600' }}>0.7536</span>
            </div>
          </div>
        </div>
      </div>

      {/* Local Storage & Cache Controls */}
      <div style={{ background: 'rgba(15, 23, 42, 0.85)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.5rem' }}>
          🧹 Cache & Session Management
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          Reset your active browser analysis session to reload fresh sample defaults.
        </p>
        <button onClick={handleClear} className="btn btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
          Clear Local Idea Cache
        </button>
        {cleared && <span style={{ marginLeft: '1rem', color: '#10b981', fontSize: '0.85rem' }}>Cache cleared!</span>}
      </div>
    </motion.div>
  );
}