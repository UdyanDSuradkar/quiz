"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";
import { Eye, EyeOff, User, Mail, Lock, UserCheck } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AuthFormProps {
  mode: "login" | "register";
}

// Helper function to get the correct URL for different environments
const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel
    "http://localhost:3000"; // development default

  // Make sure to include `https://` when not localhost
  url = url.includes("http") ? url : `https://${url}`;
  // Make sure to include trailing `/`
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;

  return url;
};

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "register") {
        // Check if email exists in your custom users table (prevents duplicate profiles)
        const { data: existingUsers, error: checkError } = await supabase
          .from("users")
          .select("id")
          .eq("email", email)
          .limit(1);

        if (checkError) {
          setError("Error checking for existing user");
          setLoading(false);
          toast.error("Registration error: Could not check user email!");
          return;
        }

        if (existingUsers && existingUsers.length > 0) {
          setError("User already registered with this email");
          setLoading(false);
          toast.error("User already registered with this email!");
          return;
        }

        // Proceed to Supabase register with email confirmation
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, role },
            // Use dynamic URL that works on both local and Vercel
            emailRedirectTo: `${getURL()}auth/login`,
          },
        });

        if (error) throw error;

        // Registration successful - user will receive confirmation email
        if (data.user) {
          toast.success(
            "Registration successful! We've sent a confirmation email to your inbox. Please click the link in the email to verify your account.",
            { autoClose: 8000 }
          );

          // Clear form fields
          setEmail("");
          setPassword("");
          setName("");
          setRole("student");

          // Show confirmation message
          setError(
            "✅ Account created! Please check your email and click the verification link to complete your registration."
          );
        }
      } else {
        // Login logic
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          // Check if user's email is confirmed
          if (!data.user.email_confirmed_at) {
            setError(
              "Please verify your email address before signing in. Check your inbox for a confirmation email."
            );
            await supabase.auth.signOut(); // Sign out unverified user
            return;
          }

          const { data: profile } = await supabase
            .from("users")
            .select("role")
            .eq("id", data.user.id)
            .single();

          const userRole = profile?.role || "student";
          toast.success("Login successful!");
          router.push(`/dashboard/${userRole}`);
        }
      }
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message || "Unexpected authentication error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-12 mb-24">
      <div className="rounded-2xl shadow-lg border border-gray-100 bg-gradient-to-br from-blue-50 via-white to-purple-50 px-8 py-10 animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight drop-shadow">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-base text-blue-700 mt-2 font-medium">
            {mode === "login"
              ? "Sign in to continue your learning journey"
              : "Join our platform and start learning today"}
          </p>
        </div>

        {error && (
          <div
            className={`border px-4 py-3 rounded-lg mb-5 shadow-sm animate-shake ${
              error.includes("✅")
                ? "bg-green-100 border-green-200 text-green-700"
                : "bg-red-100 border-red-200 text-red-700"
            }`}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "register" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field pl-10 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-300 transition-all w-full py-3 px-4"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Role
                </label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400 pointer-events-none" />
                  <select
                    value={role}
                    onChange={(e) =>
                      setRole(e.target.value as "student" | "teacher")
                    }
                    className="input-field pl-10 pr-10 rounded-xl border border-blue-100 focus:ring-2 focus:ring-indigo-300 bg-white transition-all appearance-none text-gray-800 font-medium shadow-sm h-12 hover:bg-indigo-50 focus:border-indigo-400 w-full"
                    required
                    style={{
                      backgroundImage:
                        'url(\'data:image/svg+xml;utf8,<svg fill="%236673d9" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5"/></svg>\')',
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                    }}
                  >
                    <option value="student">👨‍🎓 Student</option>
                    <option value="teacher">👩‍🏫 Teacher</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-300 transition-all w-full py-3 px-4"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10 pr-10 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-300 transition-all w-full py-3 px-4"
                placeholder="Enter a password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-base font-semibold rounded-xl transition-colors
              bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600
              text-white shadow-lg hover:from-indigo-700 hover:to-blue-700
              focus:outline-none focus:ring-2 focus:ring-indigo-400
              ${loading ? "opacity-70 cursor-wait" : ""}
            `}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {mode === "login" ? "Signing In..." : "Creating Account..."}
              </div>
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-blue-700 font-medium">
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <a
              href={mode === "login" ? "/auth/register" : "/auth/login"}
              className="text-indigo-700 underline hover:text-indigo-900 px-1 transition"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
