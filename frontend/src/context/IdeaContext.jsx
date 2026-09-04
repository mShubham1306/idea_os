import React, { createContext, useContext, useState } from 'react';

const IdeaContext = createContext(null);

const DEFAULT_DEMO_IDEA = {
  idea: {
    title: 'Panipur Quick-Serve Chain & Automated Kitchen',
    description: 'A modern, tech-enabled hygienic street food quick-service restaurant chain specializing in panipuri with automated dispensing, inventory tracking, and franchise management.',
    category: 'FoodTech',
  },
  score: 6.8,
  idea_quality: 'Good',
  detected_sector: 'FoodTech',
  sentiment: 'positive',
  summary: 'The idea demonstrates promising consumer demand and franchise scalability. Automating dispensing solves critical hygiene concerns in the street food market. Initial unit economics and supplier margins require strict validation.',
  detailed_analysis: {
    innovation: 72,
    market_demand: 82,
    scalability: 76,
    risk_level: 'Medium',
    target_audience: 'Urban youth, college students, and hygiene-conscious street food lovers',
    monetization: 'Direct QSR sales, franchise licensing fees, and proprietary ingredient supply packs',
    competitive_advantage: 'Automated hygienic dispensing machine and standardized consistent flavor formulation',
    strengths: [
      'Massive culturally validated market demand with huge daily footfall',
      'Automated hygiene addresses the #1 consumer objection in street food',
      'High gross margin per serving (65-75%)'
    ],
    weaknesses: [
      'High initial machine fabrication and store leasing capex',
      'Quality control across franchised locations requires strict SOPs',
      'Intense competition from low-cost unorganized street vendors'
    ],
    recommendations: [
      'Pilot with 2 modular pop-up kiosks in high-density malls to validate footfall',
      'Partner with reliable local food-grade machine manufacturers',
      'Establish central commissary for spice and sauce packets'
    ]
  },
  ml_prediction: {
    ml_success_probability: 64.2,
    risk_index: 'Moderate Risk (Standard Startup Curve)',
    matched_sector: 'FoodTech',
    sector_success_rate: 51.4,
    sector_sample_size: 2150,
    estimated_funding_usd: 650000,
    sector_quartiles: {
      p25: 75000,
      median: 450000,
      p75: 2200000,
      p90: 8500000
    },
    histogram_distribution: [
      { label: '< $50K', count: 520 },
      { label: '$50K - $250K', count: 440 },
      { label: '$250K - $1M', count: 390 },
      { label: '$1M - $5M', count: 280 },
      { label: '$5M - $20M', count: 140 },
      { label: '> $20M', count: 60 }
    ],
    historical_comparables: {
      success: [
        { name: 'Chai Point', funding_numeric: 54000000, status: 'operating' },
        { name: 'Chaayos', funding_numeric: 85000000, status: 'operating' },
        { name: 'Faasos (Rebel Foods)', funding_numeric: 500000000, status: 'operating' }
      ],
      cautionary: [
        { name: 'Samosa On Wheels', funding_numeric: 80000, status: 'closed' },
        { name: 'StreetBites Tech', funding_numeric: 120000, status: 'closed' }
      ]
    }
  },
  gemini_audit: {
    audit_verdict: 'Verified & High Accuracy',
    accuracy_confidence: 91,
    statistical_alignment: 'High',
    audit_summary: 'The 64.2% ML success probability accurately captures the high market appetite combined with retail expansion hurdles. Automation significantly improves unit margins over traditional unorganized competitors.',
    reconciliation_notes: [
      'FoodTech retail models face early capex strain but achieve rapid cash-flow positive unit economics',
      'The automated kiosk design mitigates labor shortage risks and ensures health code compliance',
      'Brand trust and localized flavor adaptation are critical for multi-city retention'
    ],
    actionable_enhancements: [
      'Secure prime kiosk locations with revenue-share leasing rather than high fixed rent',
      'Implement mobile pre-ordering to reduce peak-hour customer queuing',
      'File utility patents on the proprietary automated liquid dispenser'
    ]
  },
  score_breakdown: [
    'Keyword Diversity: 1.25 / 1.50 — Strong multi-faceted concept',
    'Description Quality: 1.30 / 1.50 — Well structured proposition',
    'Market Signals: 1.40 / 1.50 — Clear franchise & consumer metrics',
    'Innovation: 1.10 / 1.50 — Automation in traditional segment',
    'Market Alignment: 1.15 / 1.50 — Sector momentum favorable'
  ]
};

export function IdeaProvider({ children }) {
  const [activeIdea, setActiveIdeaState] = useState(() => {
    try {
      const saved = localStorage.getItem('ideaos_active_idea');
      return saved ? JSON.parse(saved) : DEFAULT_DEMO_IDEA;
    } catch {
      return DEFAULT_DEMO_IDEA;
    }
  });

  const setActiveIdea = (data) => {
    if (data) {
      setActiveIdeaState(data);
      try {
        localStorage.setItem('ideaos_active_idea', JSON.stringify(data));
      } catch (e) {
        console.error("Could not save active idea to localStorage", e);
      }
    }
  };

  return (
    <IdeaContext.Provider value={{ activeIdea, setActiveIdea }}>
      {children}
    </IdeaContext.Provider>
  );
}

export function useActiveIdea() {
  const ctx = useContext(IdeaContext);
  if (!ctx) {
    throw new Error('useActiveIdea must be used within an IdeaProvider');
  }
  return ctx;
}