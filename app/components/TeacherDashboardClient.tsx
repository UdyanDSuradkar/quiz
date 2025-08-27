"use client";

import { useState, useEffect } from "react";
import { BookOpen, Users, FileText, Plus, Loader } from "lucide-react";
import CreateQuizModal from "@/app/components/CreateQuizModal";
import EditQuizModal from "@/app/components/EditQuizModal";
import QuizCard from "@/app/components/QuizCard";
import { toast } from "react-toastify";
import toast2 from "react-hot-toast";

interface Quiz {
  id: string;
  title: string;
  subject: string;
  grade: string;
  created_at: string;
  questions: { count: number }[];
}

interface TeacherDashboardClientProps {
  profile: {
    id: string;
    name: string;
    role: string;
  };
}

export default function TeacherDashboardClient({
  profile,
}: TeacherDashboardClientProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    totalAttempts: 0,
    averageScore: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const quizzesResponse = await fetch("/api/quizzes");
      const quizzesData = quizzesResponse.ok
        ? await quizzesResponse.json()
        : [];
      setQuizzes(quizzesData);

      const resultsResponse = await fetch("/api/teacher/results");
      const resultsData = resultsResponse.ok
        ? await resultsResponse.json()
        : [];

      const totalQuestions = quizzesData.reduce(
        (sum: number, quiz: Quiz) => sum + (quiz.questions?.[0]?.count || 0),
        0
      );
      const totalAttempts = resultsData.length;
      const averageScore =
        totalAttempts > 0
          ? Math.round(
              (resultsData.reduce(
                (sum: number, a: any) =>
                  sum +
                  (a.score != null && a.total_questions
                    ? a.score / a.total_questions
                    : 0),
                0
              ) /
                totalAttempts) *
                100
            )
          : 0;

      setStats({
        totalQuizzes: quizzesData.length,
        totalQuestions,
        totalAttempts,
        averageScore,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Custom confirmation using react-hot-toast
  const handleDeleteQuiz = (quizId: string) => {
    toast2(
      (t) => (
        <div className="p-4">
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900">Delete Quiz</h3>
            <p className="text-gray-600 text-sm mt-1">
              Are you sure you want to delete this quiz? This action cannot be
              undone.
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
              onClick={() => toast2.dismiss(t.id)}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              onClick={async () => {
                toast2.dismiss(t.id);
                await performDelete(quizId);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        style: {
          maxWidth: "400px",
        },
      }
    );
  };

  const performDelete = async (quizId: string) => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Quiz deleted successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
        setQuizzes((current) => current.filter((q) => q.id !== quizId));
        fetchData();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete quiz");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete quiz", {
        position: "top-center",
        autoClose: 4000,
      });
    }
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Teacher Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Welcome back, {profile.name}!</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                My Quizzes
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {stats.totalQuizzes}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Total Questions
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {stats.totalQuestions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Quiz Attempts
              </h3>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.totalAttempts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Avg. Score
              </h3>
              <p className="text-2xl font-bold text-purple-600">
                {stats.averageScore}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">My Quizzes</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Create New
          </button>
        </div>

        {quizzes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No quizzes created yet</p>
            <p className="text-gray-400 mt-2">
              Create your first quiz to get started
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 mt-4 flex items-center mx-auto"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Quiz
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onDelete={() => handleDeleteQuiz(quiz.id)}
                onEdit={handleEditQuiz}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateQuizModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchData}
      />
      <EditQuizModal
        isOpen={showEditModal}
        quiz={editingQuiz}
        onClose={() => {
          setShowEditModal(false);
          setEditingQuiz(null);
        }}
        onSuccess={fetchData}
      />
    </div>
  );
}
