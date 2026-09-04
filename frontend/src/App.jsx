import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import SubmitIdea from './pages/SubmitIdea';
import Analysis from './pages/Analysis';
import PowerBIPage from './pages/PowerBIPage';
import AuditPage from './pages/AuditPage';
import ComparablesPage from './pages/ComparablesPage';
import CopilotPage from './pages/CopilotPage';
import History from './pages/History';
import Insights from './pages/Insights';
import SettingsPage from './pages/SettingsPage';

import DashboardLayout from './layouts/DashboardLayout';
import PublicLayout from './layouts/PublicLayout';
import { IdeaProvider } from './context/IdeaContext';

function App() {
  return (
    <IdeaProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
          </Route>

          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/submit" element={<SubmitIdea />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/powerbi" element={<PowerBIPage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route path="/comparables" element={<ComparablesPage />} />
            <Route path="/copilot" element={<CopilotPage />} />
            <Route path="/history" element={<History />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </IdeaProvider>
  );
}

export default App;