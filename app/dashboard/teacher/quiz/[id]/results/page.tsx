"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Trophy,
  TrendingUp,
  Calendar,
  Download,
  Eye,
  BarChart3,
  Star,
  Clock,
  Target,
  Award,
  Loader2,
  AlertCircle,
  Filter,
} from "lucide-react";
import Link from "next/link";

interface QuizResult {
  id: string;
  student_name: string;
  student_email: string;
  score: number;
  total_questions: number;
  percentage: number;
  submitted_at: string;
}

interface QuizAnalytics {
  quiz: {
    id: string;
    title: string;
    subject: string;
    grade: string;
  };
  analytics: {
    total_attempts: number;
    average_score: number;
    average_percentage: number;
    highest_score: number;
    lowest_score: number;
    total_questions: number;
  };
  results: QuizResult[];
}

export default function TeacherQuizResults() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<QuizAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"name" | "score" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchResults();
  }, [params.id]);

  const fetchResults = async () => {
    try {
      console.log("Fetching results for quiz:", params.id);
      const response = await fetch(`/api/teacher/quiz/${params.id}/results`);

      console.log("Response status:", response.status);

      if (response.ok) {
        const resultData = await response.json();
        console.log("Received data:", resultData);
        setData(resultData);
      } else {
        console.error("Failed to fetch results:", response.status);
        router.push("/dashboard/teacher");
      }
    } catch (error) {
      console.error("Error fetching results:", error);
      router.push("/dashboard/teacher");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-700 bg-green-100 border-green-200";
    if (percentage >= 80) return "text-blue-700 bg-blue-100 border-blue-200";
    if (percentage >= 70)
      return "text-yellow-700 bg-yellow-100 border-yellow-200";
    if (percentage >= 60)
      return "text-orange-700 bg-orange-100 border-orange-200";
    return "text-red-700 bg-red-100 border-red-200";
  };

  const getPerformanceIcon = (percentage: number) => {
    if (percentage >= 90) return <Star className="h-4 w-4 text-green-600" />;
    if (percentage >= 80) return <Trophy className="h-4 w-4 text-blue-600" />;
    if (percentage >= 70) return <Target className="h-4 w-4 text-yellow-600" />;
    return <Clock className="h-4 w-4 text-red-600" />;
  };

  const sortResults = (results: QuizResult[]) => {
    return [...results].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.student_name.localeCompare(b.student_name);
          break;
        case "score":
          comparison = a.percentage - b.percentage;
          break;
        case "date":
          comparison =
            new Date(a.submitted_at).getTime() -
            new Date(b.submitted_at).getTime();
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  };

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
              Loading Results
            </h3>
            <p className="text-gray-500 text-sm">
              Please wait while we fetch quiz analytics...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Quiz Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The quiz results you're looking for don't exist or have been
            removed.
          </p>
          <Link
            href="/dashboard/teacher"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 inline-flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const sortedResults = sortResults(data.results);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/teacher"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6 font-medium transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>

          <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-6 sm:p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-white/10 rounded-full"></div>

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                    {data.quiz.title} - Analytics
                  </h1>
                  <div className="flex items-center space-x-4 mt-4">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      {data.quiz.subject}
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      Grade {data.quiz.grade}
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      {data.analytics.total_attempts} Attempts
                    </span>
                  </div>
                </div>
                <div className="mt-4 lg:mt-0">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-indigo-100 text-sm">
                        Quiz Performance
                      </p>
                      <p className="text-xl font-bold">
                        {data.analytics.average_percentage}% Avg
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Attempts
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {data.analytics.total_attempts}
                </p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Users className="h-3 w-3 mr-1" />
                  Students participated
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-2xl group-hover:bg-blue-200 transition-colors">
                <Users className="h-8 w-8 text-blue-600" />
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
                  {data.analytics.average_score}/
                  {data.analytics.total_questions}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <Trophy className="h-3 w-3 mr-1" />
                  Out of {data.analytics.total_questions}
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
                  Average Percentage
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {data.analytics.average_percentage}%
                </p>
                <p className="text-xs text-yellow-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Class performance
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-2xl group-hover:bg-yellow-200 transition-colors">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Score Range
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {data.analytics.lowest_score}-{data.analytics.highest_score}
                </p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <Award className="h-3 w-3 mr-1" />
                  Min - Max scores
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-2xl group-hover:bg-purple-200 transition-colors">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Results Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-100 p-2 rounded-xl">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Student Results
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Detailed quiz performance analysis
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Filter className="h-4 w-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">
                  Sort by:
                </label>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split("-");
                    setSortBy(field as "name" | "score" | "date");
                    setSortOrder(order as "asc" | "desc");
                  }}
                  className="text-sm border-2 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white cursor-pointer"
                >
                  <option value="date-desc">📅 Date (Newest)</option>
                  <option value="date-asc">📅 Date (Oldest)</option>
                  <option value="name-asc">👤 Name (A-Z)</option>
                  <option value="name-desc">👤 Name (Z-A)</option>
                  <option value="score-desc">🏆 Score (Highest)</option>
                  <option value="score-asc">🏆 Score (Lowest)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
            {data.results.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Users className="h-12 w-12 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No student attempts yet
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Results will appear here once students take the quiz. Share
                  your quiz with students to get started.
                </p>
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 max-w-md mx-auto">
                  <p className="text-sm text-indigo-600 font-medium">
                    💡 Tip: Make sure your quiz has questions before sharing it
                    with students.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sortedResults.map((result, index) => (
                      <tr
                        key={result.id}
                        className="hover:bg-indigo-50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-indigo-100 w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                              <span className="text-indigo-600 font-bold text-sm">
                                {result.student_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {result.student_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {result.student_email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-gray-900">
                              {result.score}
                            </span>
                            <span className="text-gray-500">
                              / {result.total_questions}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`inline-flex items-center px-3 py-1 text-sm font-bold rounded-xl border ${getGradeColor(
                                result.percentage
                              )}`}
                            >
                              {getPerformanceIcon(result.percentage)}
                              <span className="ml-2">{result.percentage}%</span>
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(result.submitted_at)}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
