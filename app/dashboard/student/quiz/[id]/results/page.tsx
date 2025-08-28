"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Trophy,
  Clock,
  CheckCircle,
  Target,
  RotateCcw,
  Home,
  Star,
  TrendingUp,
  Award,
  Medal,
  Zap,
  Brain,
  Sparkles,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface ResultData {
  score: number;
  total_questions: number;
  percentage: number;
  submitted_at: string;
}

export default function QuizResults() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, [params.id]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/student/quiz/${params.id}/results`);
      if (response.ok) {
        const data = await response.json();
        setResults({
          score: data.result.score,
          total_questions: data.result.total_questions,
          percentage: data.result.percentage,
          submitted_at: data.result.submitted_at,
        });
      } else if (response.status === 404) {
        setError("No results found. Please take the quiz first.");
      } else {
        setError("Failed to load results.");
      }
    } catch (error) {
      console.error("Error fetching results:", error);
      setError("Failed to load results.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 bg-green-100";
    if (percentage >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreGradient = (percentage: number) => {
    if (percentage >= 90) return "from-green-500 to-emerald-500";
    if (percentage >= 80) return "from-blue-500 to-indigo-500";
    if (percentage >= 70) return "from-yellow-500 to-orange-500";
    if (percentage >= 60) return "from-orange-500 to-red-500";
    return "from-red-500 to-pink-500";
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return "Outstanding! 🌟";
    if (percentage >= 80) return "Excellent work! 🎉";
    if (percentage >= 70) return "Great job! 👏";
    if (percentage >= 60) return "Good effort! 👍";
    if (percentage >= 50) return "Keep practicing! 📚";
    return "Don't give up! 💪";
  };

  const getPerformanceIcon = (percentage: number) => {
    if (percentage >= 90) return <Star className="h-12 w-12" />;
    if (percentage >= 80) return <Trophy className="h-12 w-12" />;
    if (percentage >= 70) return <Award className="h-12 w-12" />;
    if (percentage >= 60) return <Medal className="h-12 w-12" />;
    return <Target className="h-12 w-12" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="flex flex-col items-center space-y-4 bg-white p-8 rounded-2xl shadow-xl">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <div className="absolute inset-0 h-12 w-12 animate-pulse bg-indigo-100 rounded-full opacity-75"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Loading Results
            </h3>
            <p className="text-gray-500 text-sm">
              Calculating your performance...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/dashboard/student"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6 font-medium transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              No Results Found
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">{error}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/dashboard/student/quiz/${params.id}`}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center"
              >
                <Brain className="h-5 w-5 mr-2" />
                Take Quiz
              </Link>

              <Link
                href="/dashboard/student"
                className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-200 border border-gray-300 shadow-sm hover:shadow-md hover:scale-105 flex items-center justify-center"
              >
                <Home className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/student"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6 font-medium transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        {/* Enhanced Results Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Enhanced Header Section */}
          <div
            className={`bg-gradient-to-r ${getScoreGradient(
              results.percentage
            )} p-8 text-white relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-40 h-40 bg-white/10 rounded-full"></div>

            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                  {getPerformanceIcon(results.percentage)}
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-3">Quiz Complete!</h1>
              <p className="text-xl font-medium text-white/90">
                {getScoreMessage(results.percentage)}
              </p>

              {/* Celebration Elements */}
              <div className="flex justify-center space-x-4 mt-6">
                <Sparkles className="h-6 w-6 text-white/80 animate-pulse" />
                <Zap className="h-6 w-6 text-white/80 animate-bounce" />
                <Sparkles className="h-6 w-6 text-white/80 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Enhanced Score Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Score Card */}
              <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {results.score}/{results.total_questions}
                  </div>
                  <div className="text-sm font-medium text-blue-700">
                    Questions Correct
                  </div>
                  <div className="text-xs text-blue-500 mt-1">
                    {((results.score / results.total_questions) * 100).toFixed(
                      0
                    )}
                    % accuracy
                  </div>
                </div>
              </div>

              {/* Percentage Card */}
              <div
                className={`group bg-gradient-to-br ${
                  results.percentage >= 80
                    ? "from-green-50 to-emerald-50 border-green-200"
                    : results.percentage >= 60
                    ? "from-yellow-50 to-orange-50 border-yellow-200"
                    : "from-red-50 to-pink-50 border-red-200"
                } rounded-2xl p-6 border hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="text-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform ${
                      results.percentage >= 80
                        ? "bg-green-100 group-hover:bg-green-200"
                        : results.percentage >= 60
                        ? "bg-yellow-100 group-hover:bg-yellow-200"
                        : "bg-red-100 group-hover:bg-red-200"
                    }`}
                  >
                    <CheckCircle
                      className={`h-8 w-8 ${
                        results.percentage >= 80
                          ? "text-green-600"
                          : results.percentage >= 60
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    />
                  </div>
                  <div
                    className={`text-3xl font-bold mb-2 ${
                      results.percentage >= 80
                        ? "text-green-600"
                        : results.percentage >= 60
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {results.percentage}%
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      results.percentage >= 80
                        ? "text-green-700"
                        : results.percentage >= 60
                        ? "text-yellow-700"
                        : "text-red-700"
                    }`}
                  >
                    Your Score
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      results.percentage >= 80
                        ? "text-green-500"
                        : results.percentage >= 60
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {results.percentage >= 80
                      ? "Excellent!"
                      : results.percentage >= 60
                      ? "Good job!"
                      : "Keep trying!"}
                  </div>
                </div>
              </div>

              {/* Time Card */}
              <div className="group bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="text-lg font-bold text-purple-600 mb-2">
                    Completed
                  </div>
                  <div className="text-sm font-medium text-purple-700">
                    {new Date(results.submitted_at).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </div>
                  <div className="text-xs text-purple-500 mt-1">
                    {new Date(results.submitted_at).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-8 border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-indigo-100 p-2 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Performance Insights
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">
                    Questions Answered
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {results.score} correct out of {results.total_questions}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Grade Level</p>
                  <p className="text-lg font-bold text-gray-900">
                    {results.percentage >= 90
                      ? "A+"
                      : results.percentage >= 80
                      ? "A"
                      : results.percentage >= 70
                      ? "B"
                      : results.percentage >= 60
                      ? "C"
                      : results.percentage >= 50
                      ? "D"
                      : "F"}
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/dashboard/student/quiz/${params.id}`}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center group"
              >
                <RotateCcw className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                Retake Quiz
              </Link>

              <Link
                href="/dashboard/student"
                className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-semibold py-4 px-8 rounded-xl transition-all duration-200 border border-gray-300 shadow-sm hover:shadow-md hover:scale-105 flex items-center justify-center group"
              >
                <Home className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
