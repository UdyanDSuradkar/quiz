"use client";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Send,
  Brain,
  Target,
  Users,
  BookOpen,
  Timer,
  Award,
  Zap,
  Eye,
  ChevronLeft,
  ChevronRight,
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

  // Extract the submission logic into a separate function
  const proceedWithSubmission = async () => {
    if (!quiz) return;

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

        // Show success toast
        toast.success("🎉 Quiz submitted successfully!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Navigate to results page after a brief delay
        setTimeout(() => {
          router.push(
            `/dashboard/student/quiz/${params.id}/results?score=${result.score}&total=${result.total_questions}&percentage=${result.percentage}`
          );
        }, 1000);
      } else {
        toast.error("❌ Failed to submit quiz. Please try again.", {
          position: "top-center",
          autoClose: 4000,
        });
        setIsTimerActive(true);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error(
        "❌ Network error. Please check your connection and try again.",
        {
          position: "top-center",
          autoClose: 4000,
        }
      );
      setIsTimerActive(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    // Check if all questions are answered
    const unansweredQuestions = quiz.questions.filter((q) => !answers[q.id]);
    if (unansweredQuestions.length > 0 && timeLeft > 0) {
      // Use toast instead of confirm dialog
      const toastId = toast.warning(
        (t) => (
          <div className="p-2">
            <div className="mb-3">
              <h3 className="font-bold text-amber-900 mb-2">
                ⚠️ Incomplete Quiz
              </h3>
              <p className="text-amber-800 text-sm">
                You have{" "}
                <span className="font-bold">{unansweredQuestions.length}</span>{" "}
                unanswered question{unansweredQuestions.length > 1 ? "s" : ""}.
                Are you sure you want to submit your quiz?
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                onClick={() => toast.dismiss(toastId)}
              >
                Continue Quiz
              </button>
              <button
                className="px-4 py-2 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors font-medium"
                onClick={() => {
                  toast.dismiss(toastId);
                  proceedWithSubmission();
                }}
              >
                Submit Anyway
              </button>
            </div>
          </div>
        ),
        {
          autoClose: false, // Don't auto close
          position: "top-center",
          style: {
            background: "#FEF3C7",
            border: "1px solid #F59E0B",
            borderRadius: "12px",
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
        }
      );
      return;
    }

    // If all questions are answered or time is up, proceed directly
    proceedWithSubmission();
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="flex flex-col items-center space-y-4 bg-white p-8 rounded-2xl shadow-xl">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <div className="absolute inset-0 h-12 w-12 animate-pulse bg-indigo-100 rounded-full opacity-75"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Loading Quiz
            </h3>
            <p className="text-gray-500 text-sm">
              Preparing your quiz experience...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Quiz Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The quiz you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/dashboard/student"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 inline-flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/student"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6 font-medium transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>

          <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-white/10 rounded-full"></div>

              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="mb-4 lg:mb-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                        <Brain className="h-6 w-6" />
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-bold">
                        {quiz.title}
                      </h1>
                    </div>
                    <div className="flex items-center space-x-4 text-indigo-100">
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        {quiz.subject}
                      </span>
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        Grade {quiz.grade}
                      </span>
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        by {quiz.teacher_name}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col lg:items-end space-y-3">
                    {/* Enhanced Timer */}
                    <div
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl backdrop-blur-sm border ${
                        timeLeft < 300
                          ? "bg-red-500/20 border-red-300 text-red-100"
                          : "bg-white/20 border-white/30 text-white"
                      }`}
                    >
                      <Timer className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium">Time Remaining</p>
                        <p className="text-xl font-bold">
                          {formatTime(timeLeft)}
                        </p>
                      </div>
                    </div>

                    {/* Enhanced Progress */}
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/30">
                      <div className="flex items-center space-x-3 text-white">
                        <Target className="h-4 w-4" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Progress: {getAnsweredCount()} of{" "}
                            {quiz.questions.length}
                          </p>
                          <div className="w-32 bg-white/30 rounded-full h-2 mt-1">
                            <div
                              className="bg-white h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getProgress()}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-bold">
                          {getProgress()}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Previous Attempt Warning */}
            {quiz.previous_attempt && (
              <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
                <div className="flex items-start space-x-3">
                  <div className="bg-amber-100 p-2 rounded-xl">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-1">
                      Previous Attempt Found
                    </h3>
                    <p className="text-amber-800 text-sm">
                      You previously scored{" "}
                      <span className="font-bold">
                        {quiz.previous_attempt.score}/{quiz.questions.length}
                      </span>{" "}
                      on this quiz. This new attempt will replace your previous
                      score.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced View Mode Toggle & Submit */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <div className="bg-indigo-100 p-2 rounded-xl">
                  <Eye className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("all")}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      viewMode === "all"
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "text-gray-600 hover:text-indigo-600"
                    }`}
                  >
                    All Questions
                  </button>
                  <button
                    onClick={() => setViewMode("single")}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      viewMode === "single"
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "text-gray-600 hover:text-indigo-600"
                    }`}
                  >
                    One by One
                  </button>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 flex items-center"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Submitting Quiz...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Submit Quiz
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Questions */}
        <div className="space-y-6">
          {viewMode === "all" ? (
            // Enhanced Show all questions
            quiz.questions.map((question, index) => (
              <div
                key={question.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                        answers[question.id]
                          ? "bg-green-100 text-green-800 shadow-md"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {answers[question.id] ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Question {index + 1}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {answers[question.id] ? "Answered" : "Not answered"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 leading-relaxed">
                    {question.question_text}
                  </h3>

                  <div className="space-y-3">
                    {["A", "B", "C", "D"].map((option) => {
                      const optionColors = {
                        A: "border-blue-200 hover:bg-blue-50",
                        B: "border-green-200 hover:bg-green-50",
                        C: "border-orange-200 hover:bg-orange-50",
                        D: "border-purple-200 hover:bg-purple-50",
                      };

                      return (
                        <label
                          key={option}
                          className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            answers[question.id] === option
                              ? "border-indigo-500 bg-indigo-50 text-indigo-900 shadow-md"
                              : `${
                                  optionColors[
                                    option as keyof typeof optionColors
                                  ]
                                } hover:border-gray-300`
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
                            className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-200 ${
                              answers[question.id] === option
                                ? "border-indigo-500 bg-indigo-500"
                                : "border-gray-300"
                            }`}
                          >
                            {answers[question.id] === option && (
                              <div className="w-2.5 h-2.5 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="font-bold mr-3 text-lg">
                            {option}.
                          </span>
                          <span className="text-lg">
                            {
                              question[
                                `option_${option.toLowerCase()}` as keyof Question
                              ]
                            }
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Enhanced Show one question at a time
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      Question {currentQuestion + 1} of {quiz.questions.length}
                    </h2>
                    <p className="text-indigo-100 text-sm">
                      Choose the best answer
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setCurrentQuestion(Math.max(0, currentQuestion - 1))
                      }
                      disabled={currentQuestion === 0}
                      className="bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg transition-all duration-200"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentQuestion(
                          Math.min(
                            quiz.questions.length - 1,
                            currentQuestion + 1
                          )
                        )
                      }
                      disabled={currentQuestion === quiz.questions.length - 1}
                      className="bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg transition-all duration-200"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {quiz.questions[currentQuestion] && (
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8 leading-relaxed">
                    {quiz.questions[currentQuestion].question_text}
                  </h3>

                  <div className="space-y-4">
                    {["A", "B", "C", "D"].map((option) => {
                      const optionColors = {
                        A: "from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300",
                        B: "from-green-50 to-green-100 border-green-200 hover:border-green-300",
                        C: "from-orange-50 to-orange-100 border-orange-200 hover:border-orange-300",
                        D: "from-purple-50 to-purple-100 border-purple-200 hover:border-purple-300",
                      };

                      return (
                        <label
                          key={option}
                          className={`flex items-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                            answers[quiz.questions[currentQuestion].id] ===
                            option
                              ? "border-indigo-500 bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-900 shadow-lg scale-[1.02]"
                              : `bg-gradient-to-r ${
                                  optionColors[
                                    option as keyof typeof optionColors
                                  ]
                                } shadow-sm hover:shadow-md hover:scale-[1.01]`
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${quiz.questions[currentQuestion].id}`}
                            value={option}
                            checked={
                              answers[quiz.questions[currentQuestion].id] ===
                              option
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
                            className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-200 ${
                              answers[quiz.questions[currentQuestion].id] ===
                              option
                                ? "border-indigo-500 bg-indigo-500"
                                : "border-gray-300"
                            }`}
                          >
                            {answers[quiz.questions[currentQuestion].id] ===
                              option && (
                              <div className="w-3 h-3 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="font-bold mr-4 text-xl">
                            {option}.
                          </span>
                          <span className="text-xl">
                            {
                              quiz.questions[currentQuestion][
                                `option_${option.toLowerCase()}` as keyof Question
                              ]
                            }
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center space-x-2">
                      {quiz.questions.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentQuestion(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            index === currentQuestion
                              ? "bg-indigo-600 w-8"
                              : answers[quiz.questions[index].id]
                              ? "bg-green-400"
                              : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Submit Button */}
        <div className="mt-8 mb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="text-center">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Ready to Submit?
                </h3>
                <p className="text-gray-600">
                  You've answered{" "}
                  <span className="font-bold text-indigo-600">
                    {getAnsweredCount()}
                  </span>{" "}
                  out of{" "}
                  <span className="font-bold">{quiz.questions.length}</span>{" "}
                  questions
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3 mb-4">
                  <div
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgress()}%` }}
                  />
                </div>
              </div>

              {getAnsweredCount() < quiz.questions.length && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <p className="text-amber-800 font-medium">
                      {quiz.questions.length - getAnsweredCount()} questions
                      remaining
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:scale-105 flex items-center mx-auto text-lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                    Submitting Your Quiz...
                  </>
                ) : (
                  <>
                    <Send className="h-6 w-6 mr-3" />
                    Submit Final Answers
                  </>
                )}
              </button>

              <p className="text-sm text-gray-500 mt-4">
                Time remaining:{" "}
                <span className="font-bold">{formatTime(timeLeft)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
