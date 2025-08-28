"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";
import { User, LogOut, BookOpen, Menu, X, Loader } from "lucide-react";
import { toast } from "react-toastify";

// Utility to get initials for avatar fallback
function getInitials(name: string) {
  if (!name) return "";
  const words = name.trim().split(" ");
  return words.length > 1
    ? words[0][0].toUpperCase() + words[1][0].toUpperCase()
    : words[0][0].toUpperCase();
}

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // ✨ Add loading state
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    getUser();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") getUser();
    });
    return () => subscription.unsubscribe();
  }, []);

  const getUser = async () => {
    setIsLoading(true); // ✨ Set loading when fetching user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
      setUserProfile(profile);
    } else {
      setUserProfile(null);
    }
    setIsLoading(false); // ✨ Loading complete
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    toast.success("You have been logged out.");

    // Add small delay to let user see the toast
    setTimeout(() => {
      router.push("/auth/login");
      setIsLoading(false);
    }, 1000);
  };

  // ✨ Show loading state while determining auth status
  if (isLoading) {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">QuizLearn</span>
            </Link>
            <div className="flex items-center">
              <Loader className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">QuizLearn</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  {userProfile?.role && (
                    <span className="ml-2 px-4 py-1 rounded-full bg-indigo-600 text-white font-extrabold text-lg shadow capitalize">
                      {userProfile.role}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-400 flex items-center justify-center font-bold text-white text-lg shadow">
                    {userProfile?.name
                      ? getInitials(userProfile.name)
                      : (user?.email[0] || "U").toUpperCase()}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-600 p-2 rounded-md transition-colors"
                    title="Logout"
                    disabled={isLoading}
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="px-5 py-2 rounded-xl font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white py-2 px-5 rounded-xl font-semibold shadow hover:from-purple-700 hover:to-blue-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-indigo-700 p-2 rounded transition"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 transition-all duration-200">
            {user ? (
              <>
                <div className="flex items-center space-x-2 px-3 py-2">
                  <Link
                    href={`/dashboard/${userProfile?.role || "student"}`}
                    className="block text-gray-700 hover:text-indigo-800 text-lg font-bold transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {userProfile?.name && (
                    <span className="ml-3 text-indigo-800 font-semibold text-base">
                      {userProfile.name}
                    </span>
                  )}
                  {userProfile?.role && (
                    <span className="ml-2 px-4 py-1 rounded-full bg-indigo-600 text-white font-bold text-lg shadow capitalize">
                      {userProfile.role}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3 px-3 mb-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-400 flex items-center justify-center font-bold text-white text-md shadow">
                    {userProfile?.name
                      ? getInitials(userProfile.name)
                      : (user?.email[0] || "U").toUpperCase()}
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-red-700 hover:text-red-900 px-3 py-2 rounded font-medium transition"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 px-3">
                <Link
                  href="/auth/login"
                  className="block text-blue-700 hover:text-indigo-800 py-2 rounded font-medium transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white py-2 px-5 rounded-xl font-semibold shadow hover:from-purple-700 hover:to-blue-700 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
