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
  Clock,
  Star,
  TrendingUp,
  Eye,
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
    <>
      <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative">
        {/* Enhanced Header with Gradient */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>

          <div className="flex items-start justify-between relative z-10">
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

            {/* BULLETPROOF Menu Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200 relative z-[9999]"
              style={{ position: "relative", zIndex: 9999 }}
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Enhanced Card Body */}
        <div className="p-6">
          {/* Enhanced Stats Row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-blue-50 text-blue-600 px-3 py-2 rounded-xl">
                <BookOpen className="h-4 w-4 mr-2" />
                <span className="text-sm font-semibold">
                  {questionCount}{" "}
                  {questionCount === 1 ? "Question" : "Questions"}
                </span>
              </div>
              <div className="flex items-center bg-gray-50 text-gray-600 px-3 py-2 rounded-xl">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">
                  {formatDate(quiz.created_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="mb-4">
            {questionCount === 0 ? (
              <div className="flex items-center bg-amber-50 text-amber-700 px-3 py-2 rounded-lg border border-amber-200">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Ready for questions</span>
              </div>
            ) : (
              <div className="flex items-center bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-200">
                <Star className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Quiz ready</span>
              </div>
            )}
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/dashboard/teacher/quiz/${quiz.id}/questions`}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-center shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center group"
            >
              {questionCount === 0 ? (
                <>
                  <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Add Questions
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Manage Questions
                </>
              )}
            </Link>

            <Link
              href={`/dashboard/teacher/quiz/${quiz.id}/results`}
              className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 text-sm font-semibold py-3 px-4 rounded-xl transition-all duration-200 border border-gray-300 shadow-sm hover:shadow-md hover:scale-105 flex items-center justify-center group"
            >
              <Eye className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              View Results
            </Link>
          </div>

          {/* Performance Footer */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Quiz ID: {quiz.id.slice(0, 8)}...
              </span>
              <span className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                Ready to share
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BULLETPROOF DROPDOWN - RENDERS ABSOLUTELY EVERYWHERE */}
      {showMenu && (
        <div
          className="fixed inset-0"
          style={{
            zIndex: 99999999,
            pointerEvents: "none",
          }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-25"
            style={{ pointerEvents: "auto" }}
            onClick={() => setShowMenu(false)}
          />

          {/* Menu - GUARANTEED TO SHOW */}
          <div
            className="absolute bg-white rounded-xl shadow-2xl border border-gray-200 py-2 min-w-[200px]"
            style={{
              pointerEvents: "auto",
              zIndex: 99999999,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              // Fallback positioning for mobile
              position: "fixed",
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(quiz);
                setShowMenu(false);
              }}
              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 w-full text-left transition-colors group"
            >
              <Edit className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Edit Quiz</span>
            </button>

            <Link
              href={`/dashboard/teacher/quiz/${quiz.id}/questions`}
              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full text-left transition-colors group"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
              }}
            >
              <Plus className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Manage Questions</span>
            </Link>

            <div className="border-t border-gray-100 my-1"></div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(quiz.id);
                setShowMenu(false);
              }}
              className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors group"
            >
              <Trash2 className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Delete Quiz</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
