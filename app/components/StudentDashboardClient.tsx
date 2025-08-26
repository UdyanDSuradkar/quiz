"use client";

import { useState, useEffect } from "react";
import { BookOpen, Trophy, Clock, Target, Loader, Search } from "lucide-react";
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

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quiz.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quiz.users.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Subject filter
    if (selectedSubject !== "all") {
      filtered = filtered.filter((quiz) => quiz.subject === selectedSubject);
    }

    // Grade filter
    if (selectedGrade !== "all") {
      filtered = filtered.filter((quiz) => quiz.grade === selectedGrade);
    }

    // Attempt status filter
    if (showAttempted === "attempted") {
      filtered = filtered.filter((quiz) => quiz.attempted);
    } else if (showAttempted === "not-attempted") {
      filtered = filtered.filter((quiz) => !quiz.attempted);
    }

    setFilteredQuizzes(filtered);
  };

  // Get unique subjects and grades for filters
  const subjects = [...new Set(quizzes.map((quiz) => quiz.subject))];
  const grades = [...new Set(quizzes.map((quiz) => quiz.grade))].sort();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading available quizzes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {profile.name}! Ready for your next quiz?
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Available Quizzes
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
              <Trophy className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Completed</h3>
              <p className="text-2xl font-bold text-green-600">
                {stats.attemptedQuizzes}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Target className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Average Score
              </h3>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.averageScore}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Questions Answered
              </h3>
              <p className="text-2xl font-bold text-purple-600">
                {stats.questionsAnswered}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>

          {/* Grade Filter */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Grades</option>
            {grades.map((grade) => (
              <option key={grade} value={grade}>
                Grade {grade}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={showAttempted}
            onChange={(e) => setShowAttempted(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Quizzes</option>
            <option value="not-attempted">Not Attempted</option>
            <option value="attempted">Completed</option>
          </select>
        </div>
      </div>

      {/* Quiz Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Available Quizzes ({filteredQuizzes.length})
          </h2>
        </div>

        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {quizzes.length === 0
                ? "No quizzes available yet"
                : "No quizzes match your filters"}
            </p>
            <p className="text-gray-400 mt-2">
              {quizzes.length === 0
                ? "Check back later for new quizzes from your teachers"
                : "Try adjusting your search or filters"}
            </p>
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
  );
}
