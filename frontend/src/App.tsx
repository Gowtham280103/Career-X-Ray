import { HashRouter as BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { CareerXRay } from './pages/CareerXRay';
import { Applications } from './pages/Applications';
import { InterviewCoach } from './pages/InterviewCoach';
import { AISettings } from './pages/AISettings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page — no sidebar */}
        <Route path="/" element={<Landing />} />

        {/* App routes — with sidebar layout */}
        <Route path="/" element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="xray" element={<CareerXRay />} />
          <Route path="applications" element={<Applications />} />
          <Route path="interview" element={<InterviewCoach />} />
          <Route path="settings" element={<AISettings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
