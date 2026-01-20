import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import WatermarkLayer from "./components/WatermarkLayer";

import ProgressPage from "./pages/ProgressPage";

const App: React.FC = () => {
  return (
    <div className="app-shell">
      <WatermarkLayer />

      <Header />

      <div className="app-content">
        <Routes>
          {/* Manage System: vi hoster kun Progress her */}
          <Route path="/progress" element={<ProgressPage />} />

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
