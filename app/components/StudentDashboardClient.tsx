"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Trophy,
  Clock,
  Target,
  Loader2,
  Search,
  Filter,
  Star,
  TrendingUp,
  Award,
  Users,
  GraduationCap,
  Brain,
} from "lucide-react";
import StudentQuizCard from "@/app/components/StudentQuizCard";

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

interface StudentDashboardClientProps {
  profile: {
    id: string;
    name: string;
    role: string;
  };
}

export default function StudentDashboardClient({
  profile,
}: StudentDashboardClientProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [showAttempted, setShowAttempted] = useState("all");

  const [stats, setStats] = useState({
    totalQuizzes: 0,
    attemptedQuizzes: 0,
    averageScore: 0,
    questionsAnswered: 0, // Changed from totalQuestions
  });

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    filterQuizzes();
  }, [quizzes, searchTerm, selectedSubject, selectedGrade, showAttempted]);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("/api/student/quizzes");
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);

        // Calculate stats - FIXED VERSION
        const attemptedQuizzes = data.filter((quiz: Quiz) => quiz.attempted);
        const totalScore = attemptedQuizzes.reduce(
          (sum: number, quiz: Quiz) => sum + (quiz.lastScore || 0),
          0
        );
        const totalPossibleScore = attemptedQuizzes.reduce(
          (sum: number, quiz: Quiz) => sum + (quiz.questions?.[0]?.count || 0),
          0
        );

        // Questions answered = total questions from completed quizzes only
        const questionsAnswered = attemptedQuizzes.reduce(
          (sum: number, quiz: Quiz) => sum + (quiz.questions?.[0]?.count || 0),
          0
        );

        setStats({
          totalQuizzes: data.length,
          attemptedQuizzes: attemptedQuizzes.length,
          averageScore:
            totalPossibleScore > 0
              ? Math.round((totalScore / totalPossibleScore) * 100)
              : 0,
          questionsAnswered, // Now only counts questions from attempted quizzes
        });
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterQuizzes = () => {
    let filtered = quizzes;

    // Search filter with safe null checks
    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();

      filtered = filtered.filter((quiz) => {
        // Safe access with fallbacks to empty string
        const title = (quiz?.title || "").toLowerCase();
        const subject = (quiz?.subject || "").toLowerCase();
        const userName = (quiz?.users?.name || "").toLowerCase();

        return (
          title.includes(lowerSearch) ||
          subject.includes(lowerSearch) ||
          userName.includes(lowerSearch)
        );
      });
    }

    // Subject filter
    if (selectedSubject !== "all") {
      filtered = filtered.filter((quiz) => quiz?.subject === selectedSubject);
    }

    // Grade filter
    if (selectedGrade !== "all") {
      filtered = filtered.filter((quiz) => quiz?.grade === selectedGrade);
    }

    // Attempt status filter
    if (showAttempted === "attempted") {
      filtered = filtered.filter((quiz) => quiz?.attempted === true);
    } else if (showAttempted === "not-attempted") {
      filtered = filtered.filter((quiz) => quiz?.attempted !== true);
    }

    setFilteredQuizzes(filtered);
  };

  // Get unique subjects and grades for filters
  const subjects = [...new Set(quizzes.map((quiz) => quiz.subject))];
  const grades = [...new Set(quizzes.map((quiz) => quiz.grade))].sort();

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
              Loading Quizzes
            </h3>
            <p className="text-gray-500 text-sm">
              Discovering your learning opportunities...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-6 sm:p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-white/10 rounded-full"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold">
                    Student Dashboard
                  </h1>
                  <p className="text-indigo-100 text-lg">
                    Welcome back, {profile.name.split(" ")[0]}! 🎓
                  </p>
                </div>
              </div>
              <p className="text-indigo-100 mt-4">
                Ready to ace your next quiz? Let's continue your learning
                journey!
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Available Quizzes
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalQuizzes}
                </p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Ready to explore
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-2xl group-hover:bg-blue-200 transition-colors">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Completed
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.attemptedQuizzes}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <Trophy className="h-3 w-3 mr-1" />
                  Great progress!
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-2xl group-hover:bg-green-200 transition-colors">
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Average Score
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.averageScore}%
                </p>
                <p className="text-xs text-yellow-600 flex items-center mt-1">
                  <Star className="h-3 w-3 mr-1" />
                  Keep it up!
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-2xl group-hover:bg-yellow-200 transition-colors">
                <Target className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Questions Answered
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.questionsAnswered}
                </p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <Brain className="h-3 w-3 mr-1" />
                  Knowledge gained
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-2xl group-hover:bg-purple-200 transition-colors">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 p-2 rounded-xl">
                <Filter className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Find Your Perfect Quiz
                </h2>
                <p className="text-gray-600 text-sm">
                  Use filters to discover quizzes tailored for you
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Enhanced Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search quizzes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                />
              </div>

              {/* Enhanced Subject Filter */}
              <div className="relative">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 appearance-none bg-white cursor-pointer"
                >
                  <option value="all">📚 All Subjects</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Enhanced Grade Filter */}
              <div className="relative">
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 appearance-none bg-white cursor-pointer"
                >
                  <option value="all">🎓 All Grades</option>
                  {grades.map((grade) => (
                    <option key={grade} value={grade}>
                      Grade {grade}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Enhanced Status Filter */}
              <div className="relative">
                <select
                  value={showAttempted}
                  onChange={(e) => setShowAttempted(e.target.value)}
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 appearance-none bg-white cursor-pointer"
                >
                  <option value="all">📊 All Quizzes</option>
                  <option value="not-attempted">🚀 Not Attempted</option>
                  <option value="attempted">✅ Completed</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Quiz Grid */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-100 p-2 rounded-xl">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Available Quizzes ({filteredQuizzes.length})
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Choose a quiz to start your learning adventure
                  </p>
                </div>
              </div>
              {filteredQuizzes.length > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <TrendingUp className="h-4 w-4" />
                  <span>{filteredQuizzes.length} available</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            {filteredQuizzes.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-12 w-12 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {quizzes.length === 0
                    ? "No quizzes available yet"
                    : "No quizzes match your filters"}
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {quizzes.length === 0
                    ? "Check back later for new quizzes from your teachers. Your learning journey is about to begin!"
                    : "Try adjusting your search terms or filters to find the perfect quiz for you."}
                </p>
                {quizzes.length === 0 ? (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 max-w-md mx-auto">
                    <p className="text-sm text-indigo-600 font-medium">
                      💡 Tip: New quizzes are added regularly. Stay tuned for
                      exciting challenges!
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedSubject("all");
                      setSelectedGrade("all");
                      setShowAttempted("all");
                    }}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 inline-flex items-center"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuizzes.map((quiz) => (
                  <StudentQuizCard key={quiz.id} quiz={quiz} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
