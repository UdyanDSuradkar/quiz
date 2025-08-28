"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";
import { CheckCircle, XCircle, Loader } from "lucide-react";

export default function ConfirmEmailContent() {
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const token = searchParams.get("token");
        const type = searchParams.get("type");

        if (token && type === "email") {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "email",
          });

          if (error) {
            setError("Invalid or expired confirmation link.");
          } else {
            setConfirmed(true);
            // Redirect to login after successful confirmation
            setTimeout(() => {
              router.push("/auth/login");
            }, 3000);
          }
        } else {
          setError("Invalid confirmation link.");
        }
      } catch (err) {
        setError("An error occurred while confirming your email.");
      } finally {
        setLoading(false);
      }
    };

    handleEmailConfirmation();
  }, [searchParams, router, supabase.auth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">
            Confirming your email...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          {confirmed ? (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Email Confirmed!
              </h2>
              <p className="text-gray-600 mb-4">
                Your email has been successfully verified. You can now sign in
                to your account.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to login page in 3 seconds...
              </p>
            </>
          ) : (
            <>
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Confirmation Failed
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => router.push("/auth/login")}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Go to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
