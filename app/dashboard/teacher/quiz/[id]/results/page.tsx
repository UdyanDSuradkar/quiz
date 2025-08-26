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
    if (percentage >= 90) return "text-green-700 bg-green-100";
    if (percentage >= 80) return "text-blue-700 bg-blue-100";
    if (percentage >= 70) return "text-yellow-700 bg-yellow-100";
    if (percentage >= 60) return "text-orange-700 bg-orange-100";
    return "text-red-700 bg-red-100";
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Quiz Not Found
          </h1>
          <Link
            href="/dashboard/teacher"
            className="text-blue-600 hover:underline"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const sortedResults = sortResults(data.results);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/teacher"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {data.quiz.title} - Results
            </h1>
            <p className="text-gray-600 mt-2">
              {data.quiz.subject} • Grade {data.quiz.grade}
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Total Attempts
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {data.analytics.total_attempts}
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
              <h3 className="text-lg font-semibold text-gray-900">
                Average Score
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {data.analytics.average_score}/{data.analytics.total_questions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Average %</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {data.analytics.average_percentage}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Score Range
              </h3>
              <p className="text-2xl font-bold text-purple-600">
                {data.analytics.lowest_score}-{data.analytics.highest_score}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Student Results
            </h2>

            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
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
                className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date-desc">Date (Newest)</option>
                <option value="date-asc">Date (Oldest)</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="score-desc">Score (Highest)</option>
                <option value="score-asc">Score (Lowest)</option>
              </select>
            </div>
          </div>
        </div>

        {data.results.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No student attempts yet</p>
            <p className="text-gray-400 mt-2">
              Results will appear here once students take the quiz
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedResults.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {result.student_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {result.student_email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {result.score}/{result.total_questions}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(
                          result.percentage
                        )}`}
                      >
                        {result.percentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(result.submitted_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
