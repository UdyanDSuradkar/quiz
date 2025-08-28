"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Users,
  FileText,
  Plus,
  Loader,
  TrendingUp,
  Award,
  Clock,
  BarChart3,
  Search,
  Filter,
  Grid3X3,
  List,
} from "lucide-react";
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
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    totalAttempts: 0,
    averageScore: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = quizzes.filter(
      (quiz) =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.grade.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuizzes(filtered);
  }, [searchTerm, quizzes]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const quizzesResponse = await fetch("/api/quizzes");
      const quizzesData = quizzesResponse.ok
        ? await quizzesResponse.json()
        : [];
      setQuizzes(quizzesData);
      setFilteredQuizzes(quizzesData);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="flex flex-col items-center space-y-4 bg-white p-8 rounded-2xl shadow-xl">
          <div className="relative">
            <Loader className="h-12 w-12 animate-spin text-indigo-600" />
            <div className="absolute inset-0 h-12 w-12 animate-pulse bg-indigo-100 rounded-full opacity-75"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Loading Dashboard
            </h3>
            <p className="text-gray-500 text-sm">
              Please wait while we fetch your data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-6 sm:p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                    Welcome back, {profile.name.split(" ")[0]}! 👋
                  </h1>
                  <p className="text-indigo-100 text-lg">
                    Ready to create amazing quizzes today?
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Quizzes
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalQuizzes}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Active
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-2xl group-hover:bg-blue-200 transition-colors">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Questions
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalQuestions}
                </p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Total
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-2xl group-hover:bg-green-200 transition-colors">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Attempts
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalAttempts}
                </p>
                <p className="text-xs text-yellow-600 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  Students
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-2xl group-hover:bg-yellow-200 transition-colors">
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Avg. Score
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.averageScore}%
                </p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <Award className="h-3 w-3 mr-1" />
                  Performance
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-2xl group-hover:bg-purple-200 transition-colors">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Management Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Quiz Management
                </h2>
                <p className="text-sm text-gray-600">
                  Manage and organize all your quizzes
                </p>
              </div>

              {/* Search and Controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search quizzes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setViewMode(viewMode === "grid" ? "list" : "grid")
                    }
                    className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    title={`Switch to ${
                      viewMode === "grid" ? "list" : "grid"
                    } view`}
                  >
                    {viewMode === "grid" ? (
                      <List className="h-4 w-4" />
                    ) : (
                      <Grid3X3 className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition-colors duration-200 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Create</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {filteredQuizzes.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-12 w-12 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm ? "No quizzes found" : "No quizzes created yet"}
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {searchTerm
                    ? `No quizzes match "${searchTerm}". Try adjusting your search.`
                    : "Get started by creating your first quiz. It only takes a few minutes!"}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center mx-auto shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Quiz
                  </button>
                )}
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {filteredQuizzes.map((quiz) => (
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
        </div>
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
