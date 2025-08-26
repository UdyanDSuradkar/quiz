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

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return "Outstanding! 🌟";
    if (percentage >= 80) return "Excellent work! 🎉";
    if (percentage >= 70) return "Great job! 👏";
    if (percentage >= 60) return "Good effort! 👍";
    if (percentage >= 50) return "Keep practicing! 📚";
    return "Don't give up! 💪";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/dashboard/student"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-red-600 mb-4">
            <Trophy className="h-16 w-16 mx-auto opacity-50" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            No Results Found
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/dashboard/student/quiz/${params.id}`}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Take Quiz
            </Link>

            <Link
              href="/dashboard/student"
              className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              <Home className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/student"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      {/* Results Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className={`px-8 py-6 ${getScoreColor(results.percentage)}`}>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center ${getScoreColor(
                  results.percentage
                )}`}
              >
                <Trophy className="h-10 w-10" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
            <p className="text-lg">{getScoreMessage(results.percentage)}</p>
          </div>
        </div>

        {/* Score Section */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Score */}
            <div className="text-center">
              <div className="bg-blue-50 rounded-lg p-6">
                <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-blue-600">
                  {results.score}/{results.total_questions}
                </div>
                <div className="text-sm text-gray-600">Questions Correct</div>
              </div>
            </div>

            {/* Percentage */}
            <div className="text-center">
              <div
                className={`rounded-lg p-6 ${getScoreColor(
                  results.percentage
                )}`}
              >
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                <div className="text-3xl font-bold">{results.percentage}%</div>
                <div className="text-sm opacity-80">Your Score</div>
              </div>
            </div>

            {/* Time */}
            <div className="text-center">
              <div className="bg-gray-50 rounded-lg p-6">
                <Clock className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <div className="text-lg font-semibold text-gray-600">
                  Completed
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(results.submitted_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/dashboard/student/quiz/${params.id}`}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Retake Quiz
            </Link>

            <Link
              href="/dashboard/student"
              className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
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
