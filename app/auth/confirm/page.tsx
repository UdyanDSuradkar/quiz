"use client";

import { Suspense } from "react";
import ConfirmEmailContent from "./ConfirmEmailContent";

export default function ConfirmEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
          </div>
        </div>
      }
    >
      <ConfirmEmailContent />
    </Suspense>
  );
}
