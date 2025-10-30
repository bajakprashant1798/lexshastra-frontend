"use client";

import React from "react";

export default function ImportCaseModal({ onClose }) {
  const handleVisitECourts = () => {
    window.open(
      "https://services.ecourts.gov.in/ecourtindia_v6/",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[var(--bg-elev)] text-foreground rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 border border-border/50 text-center"
      >
        <h2 className="text-2xl font-bold text-primary">
          Direct Linking Under Development
        </h2>
        <p className="text-muted mt-4 mb-6">
          Automatic case import from e-Courts is under active development.  
          For now, you can visit the official e-Courts website to find your case details manually.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            type="button"
            onClick={handleVisitECourts}
            className="w-full sm:w-auto px-6 py-2.5 bg-primary text-black font-bold rounded-lg hover:opacity-90 transition"
          >
            Visit e-Courts Website
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 border border-border/40 text-primary hover:bg-primary/10 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
