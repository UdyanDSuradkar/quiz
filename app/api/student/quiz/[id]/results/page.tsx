"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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

export default function QuizResults() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  // Get results from URL params (immediate after submission)
  const urlScore = searchParams.get("score");
  const urlTotal = searchParams.get("total");
  const urlPercentage = searchParams.get("percentage");

  useEffect(() => {
    // We have the results from URL params, no need to fetch
    if (urlScore && urlTotal && urlPercentage) {
      setLoading(false);
    } else {
      // If no URL params, redirect back to dashboard
      router.push("/dashboard/student");
    }
  }, [urlScore, urlTotal, urlPercentage, router]);

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

  // Use URL params for displaying results
  const score = parseInt(urlScore!);
  const total = parseInt(urlTotal!);
  const percentage = parseInt(urlPercentage!);

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
        <div className={`px-8 py-6 ${getScoreColor(percentage)}`}>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center ${getScoreColor(
                  percentage
                )}`}
              >
                <Trophy className="h-10 w-10" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
            <p className="text-lg">{getScoreMessage(percentage)}</p>
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
                  {score}/{total}
                </div>
                <div className="text-sm text-gray-600">Questions Correct</div>
              </div>
            </div>

            {/* Percentage */}
            <div className="text-center">
              <div className={`rounded-lg p-6 ${getScoreColor(percentage)}`}>
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                <div className="text-3xl font-bold">{percentage}%</div>
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
                <div className="text-sm text-gray-500">Just now</div>
              </div>
            </div>
          </div>

          {/* Performance Analysis */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Performance Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium">Correct Answers: {score}</span>
                </div>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-red-600 mr-2"></div>
                  <span className="font-medium">
                    Incorrect Answers: {total - score}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">
                  <div>
                    Accuracy Rate:{" "}
                    <span className="font-semibold">{percentage}%</span>
                  </div>
                  <div className="mt-1">
                    {percentage >= 80
                      ? "🎯 Excellent accuracy!"
                      : percentage >= 60
                      ? "📈 Good progress, keep improving!"
                      : "📚 Consider reviewing the material"}
                  </div>
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

          {/* Study Recommendations */}
          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              💡 Study Recommendations
            </h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              {percentage < 60 && (
                <>
                  <li>• Review the quiz material thoroughly</li>
                  <li>• Practice similar questions</li>
                  <li>• Ask your teacher for additional help</li>
                </>
              )}
              {percentage >= 60 && percentage < 80 && (
                <>
                  <li>• Focus on the topics you found challenging</li>
                  <li>• Practice more questions in weak areas</li>
                  <li>• Great progress, keep it up!</li>
                </>
              )}
              {percentage >= 80 && (
                <>
                  <li>• Excellent work! You've mastered this topic</li>
                  <li>• Try more challenging quizzes</li>
                  <li>• Help other students who might be struggling</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
