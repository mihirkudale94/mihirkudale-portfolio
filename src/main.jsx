import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { onCLS, onINP, onLCP, onFCP, onTTFB } from "web-vitals";

// Send Core Web Vitals to /api/vitals (logged in Vercel production dashboard)
const reportWebVitals = ({ name, value, rating, id }) => {
  if (import.meta.env.DEV) {
    console.log(`[Web Vital] ${name}: ${Math.round(value)}ms (${rating})`);
  }
  const payload = JSON.stringify({ name, value, rating, id });
  navigator.sendBeacon("/api/vitals", new Blob([payload], { type: "application/json" }));
};

onCLS(reportWebVitals);
onINP(reportWebVitals);
onLCP(reportWebVitals);
onFCP(reportWebVitals);
onTTFB(reportWebVitals);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
