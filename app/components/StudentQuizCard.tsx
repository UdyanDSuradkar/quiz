"use client";

import { Calendar, BookOpen, User, Clock, Trophy, Play } from "lucide-react";
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {quiz.title}
          </h3>
          <p className="text-sm text-gray-600">
            {quiz.subject} • Grade {quiz.grade}
          </p>
        </div>

        {quiz.attempted && (
          <div className="flex items-center bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
            <Trophy className="h-3 w-3 mr-1" />
            Completed
          </div>
        )}
      </div>

      {/* Quiz Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <User className="h-4 w-4 mr-2" />
          <span>by {teacherName}</span>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <BookOpen className="h-4 w-4 mr-2" />
          <span>{questionCount} questions</span>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Created {formatDate(quiz.created_at)}</span>
        </div>
      </div>

      {/* Attempt Status */}
      {quiz.attempted && quiz.lastScore !== undefined && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">
                Previous Score
              </p>
              <p className="text-lg font-bold text-blue-600">
                {quiz.lastScore}/{questionCount} (
                {Math.round((quiz.lastScore / questionCount) * 100)}%)
              </p>
            </div>
            {quiz.lastAttempt && (
              <div className="text-right">
                <p className="text-xs text-blue-700">Last attempt</p>
                <p className="text-xs text-blue-600">
                  {formatDateTime(quiz.lastAttempt)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        <Link
          href={`/dashboard/student/quiz/${quiz.id}`}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-center flex items-center justify-center"
        >
          <Play className="h-4 w-4 mr-2" />
          {quiz.attempted ? "Retake Quiz" : "Start Quiz"}
        </Link>

        {quiz.attempted && (
          <Link
            href={`/dashboard/student/quiz/${quiz.id}/results`}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            View Results
          </Link>
        )}
      </div>
    </div>
  );
}
