"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader,
  Send,
} from "lucide-react";
import Link from "next/link";

interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
}

interface Quiz {
  id: string;
  title: string;
  subject: string;
  grade: string;
  teacher_name: string;
  questions: Question[];
  previous_attempt?: {
    score: number;
    submitted_at: string;
  };
}

export default function QuizAttempt() {
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [viewMode, setViewMode] = useState<"single" | "all">("all");
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [params.id]);

  useEffect(() => {
    // Start timer when quiz loads (30 minutes = 1800 seconds)
    if (quiz && !isTimerActive) {
      setTimeLeft(1800); // 30 minutes
      setIsTimerActive(true);
    }
  }, [quiz]);

  useEffect(() => {
    // Timer countdown
    if (isTimerActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isTimerActive) {
      // Auto-submit when time runs out
      handleSubmit();
    }
  }, [timeLeft, isTimerActive]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/student/quiz/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setQuiz(data);
      } else {
        router.push("/dashboard/student");
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      router.push("/dashboard/student");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    // Check if all questions are answered
    const unansweredQuestions = quiz.questions.filter((q) => !answers[q.id]);
    if (unansweredQuestions.length > 0 && timeLeft > 0) {
      if (
        !confirm(
          `You have ${unansweredQuestions.length} unanswered questions. Are you sure you want to submit?`
        )
      ) {
        return;
      }
    }

    setSubmitting(true);
    setIsTimerActive(false);

    try {
      const response = await fetch(`/api/student/quiz/${params.id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      if (response.ok) {
        const result = await response.json();
        // Navigate to results page
        router.push(
          `/dashboard/student/quiz/${params.id}/results?score=${result.score}&total=${result.total_questions}&percentage=${result.percentage}`
        );
      } else {
        alert("Failed to submit quiz. Please try again.");
        setIsTimerActive(true);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz. Please try again.");
      setIsTimerActive(true);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const getProgress = () => {
    if (!quiz) return 0;
    return Math.round((getAnsweredCount() / quiz.questions.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading quiz...</span>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Quiz Not Found
          </h1>
          <Link
            href="/dashboard/student"
            className="text-blue-600 hover:underline"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/student"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-gray-600 mt-1">
                {quiz.subject} • Grade {quiz.grade}
              </p>
              <p className="text-sm text-gray-500">by {quiz.teacher_name}</p>
            </div>

            <div className="mt-4 lg:mt-0 flex flex-col lg:items-end space-y-2">
              {/* Timer */}
              <div
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                  timeLeft < 300
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                <Clock className="h-4 w-4" />
                <span className="font-medium">{formatTime(timeLeft)}</span>
              </div>

              {/* Progress */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>
                  {getAnsweredCount()} of {quiz.questions.length} answered
                </span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgress()}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Previous Attempt Warning */}
          {quiz.previous_attempt && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-yellow-800">
                  You previously scored {quiz.previous_attempt.score}/
                  {quiz.questions.length} on this quiz. This attempt will
                  replace your previous score.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <button
                onClick={() => setViewMode("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Questions
              </button>
              <button
                onClick={() => setViewMode("single")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === "single"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                One by One
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {submitting ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Quiz
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {viewMode === "all" ? (
          // Show all questions
          quiz.questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                    answers[question.id]
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {answers[question.id] ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {question.question_text}
                  </h3>

                  <div className="space-y-3">
                    {["A", "B", "C", "D"].map((option) => (
                      <label
                        key={option}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                          answers[question.id] === option
                            ? "border-blue-500 bg-blue-50 text-blue-900"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={(e) =>
                            handleAnswerSelect(question.id, e.target.value)
                          }
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                            answers[question.id] === option
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {answers[question.id] === option && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <span className="font-medium mr-2">{option}.</span>
                        <span>
                          {
                            question[
                              `option_${option.toLowerCase()}` as keyof Question
                            ]
                          }
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Show one question at a time
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setCurrentQuestion(Math.max(0, currentQuestion - 1))
                  }
                  disabled={currentQuestion === 0}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentQuestion(
                      Math.min(quiz.questions.length - 1, currentQuestion + 1)
                    )
                  }
                  disabled={currentQuestion === quiz.questions.length - 1}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>

            {quiz.questions[currentQuestion] && (
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-6">
                  {quiz.questions[currentQuestion].question_text}
                </h3>

                <div className="space-y-3">
                  {["A", "B", "C", "D"].map((option) => (
                    <label
                      key={option}
                      className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                        answers[quiz.questions[currentQuestion].id] === option
                          ? "border-blue-500 bg-blue-50 text-blue-900"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${quiz.questions[currentQuestion].id}`}
                        value={option}
                        checked={
                          answers[quiz.questions[currentQuestion].id] === option
                        }
                        onChange={(e) =>
                          handleAnswerSelect(
                            quiz.questions[currentQuestion].id,
                            e.target.value
                          )
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                          answers[quiz.questions[currentQuestion].id] === option
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {answers[quiz.questions[currentQuestion].id] ===
                          option && (
                          <div className="w-2.5 h-2.5 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="font-medium mr-3 text-lg">
                        {option}.
                      </span>
                      <span className="text-lg">
                        {
                          quiz.questions[currentQuestion][
                            `option_${option.toLowerCase()}` as keyof Question
                          ]
                        }
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
