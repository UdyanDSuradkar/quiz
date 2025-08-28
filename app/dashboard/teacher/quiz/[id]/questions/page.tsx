"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Save,
  X,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";

interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  created_at: string;
}

interface Quiz {
  id: string;
  title: string;
  subject: string;
  grade: string;
  questions: Question[];
}

export default function QuestionManagement() {
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: "A",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [params.id]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quizzes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setQuiz(data);
      } else {
        router.push("/dashboard/teacher");
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      router.push("/dashboard/teacher");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quiz_id: params.id,
          ...newQuestion,
        }),
      });

      // in handleAddQuestion after successful add:
      if (response.ok) {
        setNewQuestion({
          question_text: "",
          option_a: "",
          option_b: "",
          option_c: "",
          option_d: "",
          correct_option: "A",
        });
        setShowAddForm(false);
        fetchQuiz(); // Refresh the quiz data
        toast.success("Question added successfully!");
      } else {
        alert("Failed to add question. Please try again.");
      }
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add question. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    setSubmitting(true);

    try {
      const response = await fetch(`/api/questions/${editingQuestion.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question_text: editingQuestion.question_text,
          option_a: editingQuestion.option_a,
          option_b: editingQuestion.option_b,
          option_c: editingQuestion.option_c,
          option_d: editingQuestion.option_d,
          correct_option: editingQuestion.correct_option,
        }),
      });

      // in handleEditQuestion after successful update:
      if (response.ok) {
        setEditingQuestion(null);
        fetchQuiz(); // Refresh the quiz data
        toast.success("Question updated successfully!");
      } else {
        alert("Failed to update question. Please try again.");
      }
    } catch (error) {
      console.error("Error updating question:", error);
      alert("Failed to update question. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    const toastId = toast(
      (t) => (
        <div className="p-4">
          <div className="mb-3 font-semibold text-gray-900">
            Delete this question?
          </div>
          <div className="flex gap-2 justify-end">
            <button
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
              onClick={() => toast.dismiss(toastId)}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
              onClick={async () => {
                toast.dismiss(toastId);
                try {
                  const response = await fetch(`/api/questions/${questionId}`, {
                    method: "DELETE",
                  });

                  if (response.ok) {
                    fetchQuiz(); // Refresh the quiz data
                    toast.success("Question deleted successfully!");
                  } else {
                    toast.error("Failed to delete question. Please try again.");
                  }
                } catch (error) {
                  console.error("Error deleting question:", error);
                  toast.error("Failed to delete question. Please try again.");
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        autoClose: 10000,
        position: "top-center",
        closeOnClick: false,
        closeButton: false,
      }
    );
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
              Please wait while we fetch your questions...
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
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Quiz Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The quiz you're looking for doesn't exist or has been removed.
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                    {quiz.title}
                  </h1>
                  <div className="flex items-center space-x-4">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      {quiz.subject}
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      Grade {quiz.grade}
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      {quiz.questions.length} Questions
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Question
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Add Question Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-green-100">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-xl">
                  <HelpCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Add New Question
                  </h2>
                  <p className="text-green-600 text-sm">
                    Create an engaging question for your quiz
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAddQuestion} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <HelpCircle className="h-4 w-4 mr-2 text-indigo-600" />
                  Question Text *
                </label>
                <textarea
                  value={newQuestion.question_text}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      question_text: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                  rows={3}
                  placeholder="Enter your question here..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    key: "option_a",
                    label: "Option A",
                    color: "bg-blue-50 text-blue-600",
                  },
                  {
                    key: "option_b",
                    label: "Option B",
                    color: "bg-green-50 text-green-600",
                  },
                  {
                    key: "option_c",
                    label: "Option C",
                    color: "bg-orange-50 text-orange-600",
                  },
                  {
                    key: "option_d",
                    label: "Option D",
                    color: "bg-purple-50 text-purple-600",
                  },
                ].map(({ key, label, color }) => (
                  <div key={key} className="space-y-2">
                    <label
                      className={`block text-sm font-semibold ${
                        color.split(" ")[1]
                      } flex items-center`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full ${color} flex items-center justify-center text-xs font-bold mr-2`}
                      >
                        {label.split(" ")[1]}
                      </span>
                      {label} *
                    </label>
                    <input
                      type="text"
                      value={newQuestion[key as keyof typeof newQuestion]}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          [key]: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                      placeholder={`Enter ${label.toLowerCase()}`}
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Correct Answer *
                </label>
                <select
                  value={newQuestion.correct_option}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      correct_option: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 appearance-none bg-white cursor-pointer"
                  required
                >
                  <option value="A">🔵 Option A</option>
                  <option value="B">🟢 Option B</option>
                  <option value="C">🟠 Option C</option>
                  <option value="D">🟣 Option D</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-200 border border-gray-300 hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center"
                >
                  {submitting ? (
                    <div className="flex items-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Adding Question...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Plus className="h-5 w-5 mr-2" />
                      Add Question
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Enhanced Questions List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-100 p-2 rounded-xl">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Questions ({quiz.questions.length})
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Manage your quiz questions
                  </p>
                </div>
              </div>
              {quiz.questions.length > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Eye className="h-4 w-4" />
                  <span>{quiz.questions.length} total</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            {quiz.questions.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-12 w-12 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No questions added yet
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Get started by adding your first question. Create engaging
                  multiple-choice questions for your students.
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center mx-auto shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Question
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {quiz.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
                  >
                    {editingQuestion?.id === question.id ? (
                      /* Enhanced Edit Form */
                      <form onSubmit={handleEditQuestion} className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-orange-100 p-2 rounded-xl">
                              <Edit className="h-5 w-5 text-orange-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">
                              Edit Question {index + 1}
                            </h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditingQuestion(null)}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>

                        <textarea
                          value={editingQuestion.question_text}
                          onChange={(e) =>
                            setEditingQuestion({
                              ...editingQuestion,
                              question_text: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          rows={3}
                          required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {["A", "B", "C", "D"].map((option) => (
                            <input
                              key={option}
                              type="text"
                              value={
                                editingQuestion[
                                  `option_${option.toLowerCase()}` as keyof Question
                                ] as string
                              }
                              onChange={(e) =>
                                setEditingQuestion({
                                  ...editingQuestion,
                                  [`option_${option.toLowerCase()}`]:
                                    e.target.value,
                                })
                              }
                              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                              placeholder={`Option ${option}`}
                              required
                            />
                          ))}
                        </div>

                        <select
                          value={editingQuestion.correct_option}
                          onChange={(e) =>
                            setEditingQuestion({
                              ...editingQuestion,
                              correct_option: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 appearance-none bg-white cursor-pointer"
                          required
                        >
                          <option value="A">🔵 Option A</option>
                          <option value="B">🟢 Option B</option>
                          <option value="C">🟠 Option C</option>
                          <option value="D">🟣 Option D</option>
                        </select>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            type="button"
                            onClick={() => setEditingQuestion(null)}
                            className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-200 border border-gray-300"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl flex items-center justify-center"
                          >
                            {submitting ? (
                              <div className="flex items-center">
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                Saving Changes...
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <Save className="h-5 w-5 mr-2" />
                                Save Changes
                              </div>
                            )}
                          </button>
                        </div>
                      </form>
                    ) : (
                      /* Enhanced Display Mode */
                      <>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-indigo-100 p-2 rounded-xl">
                              <span className="text-indigo-600 font-bold text-sm">
                                {index + 1}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">
                              Question {index + 1}
                            </h3>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingQuestion(question)}
                              className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-2 rounded-lg transition-colors"
                              title="Edit question"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(question.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                              title="Delete question"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                          <p className="text-gray-800 text-lg leading-relaxed">
                            {question.question_text}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {["A", "B", "C", "D"].map((option) => {
                            const isCorrect =
                              question.correct_option === option;
                            const optionColors = {
                              A: "border-blue-200 bg-blue-50 text-blue-800",
                              B: "border-green-200 bg-green-50 text-green-800",
                              C: "border-orange-200 bg-orange-50 text-orange-800",
                              D: "border-purple-200 bg-purple-50 text-purple-800",
                            };

                            return (
                              <div
                                key={option}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                  isCorrect
                                    ? "bg-green-100 border-green-300 text-green-900 shadow-md"
                                    : optionColors[
                                        option as keyof typeof optionColors
                                      ]
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <span
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                      isCorrect
                                        ? "bg-green-200 text-green-800"
                                        : "bg-white/50"
                                    }`}
                                  >
                                    {option}
                                  </span>
                                  <span className="flex-1 font-medium">
                                    {
                                      question[
                                        `option_${option.toLowerCase()}` as keyof Question
                                      ]
                                    }
                                  </span>
                                  {isCorrect && (
                                    <div className="flex items-center space-x-1">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                      <span className="text-xs font-bold text-green-700">
                                        CORRECT
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
