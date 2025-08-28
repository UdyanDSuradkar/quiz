"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";
import {
  User,
  LogOut,
  BookOpen,
  Menu,
  X,
  Loader,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
    setIsLoading(true);
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
    setIsLoading(false);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    toast.success("You have been logged out.");
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);

    setTimeout(() => {
      router.push("/auth/login");
      setIsLoading(false);
    }, 1000);
  };

  // Loading state
  if (isLoading) {
    return (
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                QuizLearn
              </span>
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
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <BookOpen className="h-8 w-8 text-indigo-600 group-hover:scale-110 transition-transform duration-200" />
            <span className="text-xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              QuizLearn
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Role Badge */}
                {userProfile?.role && (
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-lg capitalize">
                    {userProfile.role}
                  </span>
                )}

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-lg">
                      {userProfile?.name
                        ? getInitials(userProfile.name)
                        : (user?.email[0] || "U").toUpperCase()}
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {userProfile?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        href={`/dashboard/${userProfile?.role || "student"}`}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{isLoading ? "Signing out..." : "Sign out"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 py-2 px-5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 hover:from-gray-200 hover:to-gray-300 border border-gray-300"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 hover:from-indigo-700 hover:to-purple-700"
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
              className="p-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition-colors"
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
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-sm rounded-lg mt-2 border border-gray-200 shadow-lg">
              {user ? (
                <>
                  {/* User Info Card */}
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
                      {userProfile?.name
                        ? getInitials(userProfile.name)
                        : (user?.email[0] || "U").toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {userProfile?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                      {userProfile?.role && (
                        <span className="inline-block mt-1 px-2 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-xs capitalize">
                          {userProfile.role}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mobile Menu Items */}
                  <Link
                    href={`/dashboard/${userProfile?.role || "student"}`}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="font-medium">Dashboard</span>
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    disabled={isLoading}
                    className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">
                      {isLoading ? "Signing out..." : "Sign out"}
                    </span>
                  </button>
                </>
              ) : (
                <div className="space-y-3 flex flex-col items-center">
                  <Link
                    href="/auth/login"
                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 font-semibold text-center hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-md hover:shadow-lg border border-gray-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-center hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </nav>
  );
}
