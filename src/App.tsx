import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import WatermarkLayer from "./components/WatermarkLayer";

import ProgressPage from "./pages/ProgressPage";
import ProgressOverviewPage from "./pages/ProgressOverviewPage";
import ProgressPricingPage from "./pages/ProgressPricingPage";
import ProgressCheckoutPage from "./pages/ProgressCheckoutPage";
import ProgressAppPage from "./pages/ProgressAppPage";

const App: React.FC = () => {
  return (
    <div className="app-shell">
      <WatermarkLayer />

      <Header />

      <div className="app-content">
        <Routes>
          {/* Manage System: Progress-universet */}
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/progress/oversikt" element={<ProgressOverviewPage />} />
          <Route path="/progress/priser" element={<ProgressPricingPage />} />
          <Route path="/progress/app" element={<ProgressAppPage />} />
          <Route path="/progress/checkout" element={<ProgressCheckoutPage />} />

          {/* Alt annet sendes til /progress */}
          <Route path="/" element={<Navigate to="/progress" replace />} />
          <Route path="*" element={<Navigate to="/progress" replace />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;
