import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WatermarkLayer from "./components/WatermarkLayer";

import HomePage from "./pages/HomePage";
import ProgressPage from "./pages/ProgressPage";
import ProgressOverviewPage from "./pages/ProgressOverviewPage";
import ProgressPricingPage from "./pages/ProgressPricingPage";
import ProgressCheckoutPage from "./pages/ProgressCheckoutPage";
import ProgressAppPage from "./pages/ProgressAppPage";

import ProgressFremdriftsplanPage from "./pages/ProgressFremdriftsplanPage";
import ProgressFremdriftsplanBrukPage from "./pages/ProgressFremdriftsplanBrukPage";

const App: React.FC = () => {
  return (
    <div className="app-shell">
      <Header />

      <ScrollToTop />

      <div className="app-content" data-scroll-container>
        <Routes>
          {/* Manage System landing page */}
          <Route path="/" element={<HomePage />} />

          {/* Manage System: Progress-universet */}
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/progress/oversikt" element={<ProgressOverviewPage />} />
          <Route path="/progress/priser" element={<ProgressPricingPage />} />

          {/* SEO-/læringssider */}
          <Route path="/progress/fremdriftsplan" element={<ProgressFremdriftsplanPage />} />
          <Route path="/progress/fremdriftsplan-bruk" element={<ProgressFremdriftsplanBrukPage />} />

          <Route path="/progress/app" element={<ProgressAppPage />} />
          <Route path="/progress/checkout" element={<ProgressCheckoutPage />} />

          {/* Ukjente ruter sendes til Manage System-forsiden */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;
