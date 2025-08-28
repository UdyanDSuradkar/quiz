"use client";

import {
  Calendar,
  BookOpen,
  User,
  Clock,
  Trophy,
  Play,
  Star,
  CheckCircle,
  AlertCircle,
  Target,
  Award,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface Quiz {
  id: string;
  title: string;
  subject: string;
  grade: string;
  created_at: string;
  questions: { count: number }[];
  users: { name: string };
  attempted: boolean;
  lastScore?: number;
  lastAttempt?: string;
}

interface StudentQuizCardProps {
  quiz: Quiz;
}

export default function StudentQuizCard({ quiz }: StudentQuizCardProps) {
  const questionCount = quiz.questions?.[0]?.count || 0;
  const teacherName = quiz.users?.name || "Unknown Teacher";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get performance color and icon
  const getPerformanceDetails = () => {
    if (!quiz.attempted || quiz.lastScore === undefined) return null;

    const percentage = Math.round((quiz.lastScore / questionCount) * 100);

    if (percentage >= 90) {
      return {
        color: "from-green-500 to-emerald-500",
        bgColor: "bg-green-50 border-green-200",
        textColor: "text-green-800",
        icon: <Star className="h-4 w-4 text-green-600" />,
        grade: "Excellent!",
      };
    } else if (percentage >= 80) {
      return {
        color: "from-blue-500 to-indigo-500",
        bgColor: "bg-blue-50 border-blue-200",
        textColor: "text-blue-800",
        icon: <Trophy className="h-4 w-4 text-blue-600" />,
        grade: "Great job!",
      };
    } else if (percentage >= 70) {
      return {
        color: "from-yellow-500 to-orange-500",
        bgColor: "bg-yellow-50 border-yellow-200",
        textColor: "text-yellow-800",
        icon: <Target className="h-4 w-4 text-yellow-600" />,
        grade: "Good work!",
      };
    } else {
      return {
        color: "from-orange-500 to-red-500",
        bgColor: "bg-orange-50 border-orange-200",
        textColor: "text-orange-800",
        icon: <AlertCircle className="h-4 w-4 text-orange-600" />,
        grade: "Try again!",
      };
    }
  };

  const performanceDetails = getPerformanceDetails();

  return (
    <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative">
      {/* Card Header with Subject Badge */}
      <div
        className={`${
          quiz.attempted
            ? `bg-gradient-to-r ${
                performanceDetails?.color || "from-indigo-500 to-purple-600"
              }`
            : "bg-gradient-to-r from-indigo-500 to-purple-600"
        } p-4 text-white relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 pr-4">
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:scale-105 transition-transform">
                {quiz.title}
              </h3>
              <div className="flex items-center space-x-3">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                  {quiz.subject}
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                  Grade {quiz.grade}
                </span>
              </div>
            </div>

            {/* Status Badge */}
            {quiz.attempted ? (
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                <span className="text-xs font-bold">Completed</span>
              </div>
            ) : (
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                <span className="text-xs font-bold">New</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        {/* Quiz Information */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <User className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <span className="font-medium text-gray-900">Teacher</span>
              <p className="text-gray-600">{teacherName}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <div className="bg-green-100 p-2 rounded-lg">
              <BookOpen className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <span className="font-medium text-gray-900">Questions</span>
              <p className="text-gray-600">{questionCount} questions</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Calendar className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <span className="font-medium text-gray-900">Created</span>
              <p className="text-gray-600">{formatDate(quiz.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Performance Section */}
        {quiz.attempted &&
          quiz.lastScore !== undefined &&
          performanceDetails && (
            <div
              className={`${performanceDetails.bgColor} border rounded-xl p-4 mb-6`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    {performanceDetails.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Previous Score
                    </p>
                    <p
                      className={`text-lg font-bold ${performanceDetails.textColor}`}
                    >
                      {quiz.lastScore}/{questionCount} (
                      {Math.round((quiz.lastScore / questionCount) * 100)}%)
                    </p>
                    <p className="text-xs font-medium text-gray-600">
                      {performanceDetails.grade}
                    </p>
                  </div>
                </div>

                {quiz.lastAttempt && (
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-500 font-medium">
                        Last attempt
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {formatDateTime(quiz.lastAttempt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/dashboard/student/quiz/${quiz.id}`}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-center shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center group"
          >
            <Play className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            {quiz.attempted ? "Retake Quiz" : "Start Quiz"}
          </Link>

          {quiz.attempted && (
            <Link
              href={`/dashboard/student/quiz/${quiz.id}/results`}
              className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 text-sm font-semibold py-3 px-4 rounded-xl transition-all duration-200 border border-gray-300 shadow-sm hover:shadow-md hover:scale-105 flex items-center justify-center group"
            >
              <Award className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              View Results
            </Link>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center">
              <Target className="h-3 w-3 mr-1" />
              Quiz ID: {quiz.id.slice(0, 8)}...
            </span>
            <span className="flex items-center">
              {quiz.attempted ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-600 font-medium">Completed</span>
                </>
              ) : (
                <>
                  <Clock className="h-3 w-3 mr-1" />
                  Ready to start
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
