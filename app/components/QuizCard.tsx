"use client";

import { useState } from "react";
import {
  Calendar,
  BookOpen,
  Users,
  MoreVertical,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import Link from "next/link";

interface Quiz {
  id: string;
  title: string;
  subject: string;
  grade: string;
  created_at: string;
  questions: { count: number }[];
}

interface QuizCardProps {
  quiz: Quiz;
  onDelete: (id: string) => void;
  onEdit: (quiz: Quiz) => void;
}

export default function QuizCard({ quiz, onDelete, onEdit }: QuizCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const questionCount = quiz.questions?.[0]?.count || 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {quiz.title}
          </h3>
          <p className="text-sm text-gray-600">
            {quiz.subject} • Grade {quiz.grade}
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={() => {
                  onEdit(quiz);
                  setShowMenu(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Quiz
              </button>
              <Link
                href={`/dashboard/teacher/quiz/${quiz.id}/questions`}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                onClick={() => setShowMenu(false)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Manage Questions
              </Link>
              <button
                onClick={() => {
                  onDelete(quiz.id);
                  setShowMenu(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Quiz
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center">
          <BookOpen className="h-4 w-4 mr-1" />
          {questionCount} questions
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {formatDate(quiz.created_at)}
        </div>
      </div>

      <div className="flex space-x-2">
        <Link
          href={`/dashboard/teacher/quiz/${quiz.id}/questions`}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-center"
        >
          {questionCount === 0 ? "Add Questions" : "Manage Questions"}
        </Link>
        <Link
          href={`/dashboard/teacher/quiz/${quiz.id}/results`}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Results
        </Link>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div className="fixed inset-0 z-0" onClick={() => setShowMenu(false)} />
      )}
    </div>
  );
}
