import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { HomePage } from '@/pages/Home';
import { DesignSystemPage } from '@/pages/DesignSystem';
import {
  SubmitProblemPlaceholder,
  AdminDashboardPlaceholder,
  ProjectTrackingPlaceholder,
} from '@/pages/Placeholders';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/design-system" element={<DesignSystemPage />} />
          <Route path="/submit-problem" element={<SubmitProblemPlaceholder />} />
          <Route path="/problem-bank" element={<AdminDashboardPlaceholder />} />
          <Route path="/admin" element={<AdminDashboardPlaceholder />} />
          <Route path="/track-status" element={<ProjectTrackingPlaceholder />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

