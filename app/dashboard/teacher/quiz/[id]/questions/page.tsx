"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Edit, Trash2, BookOpen, Save, X } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
            href="/dashboard/teacher"
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
          href="/dashboard/teacher"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-gray-600 mt-2">
              {quiz.subject} • Grade {quiz.grade}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Question
            </button>
          </div>
        </div>
      </div>

      {/* Add Question Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Add New Question
          </h2>
          <form onSubmit={handleAddQuestion} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Enter your question here..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Option A *
                </label>
                <input
                  type="text"
                  value={newQuestion.option_a}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, option_a: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Option A"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Option B *
                </label>
                <input
                  type="text"
                  value={newQuestion.option_b}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, option_b: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Option B"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Option C *
                </label>
                <input
                  type="text"
                  value={newQuestion.option_c}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, option_c: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Option C"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Option D *
                </label>
                <input
                  type="text"
                  value={newQuestion.option_d}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, option_d: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Option D"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {submitting ? "Adding..." : "Add Question"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Questions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Questions ({quiz.questions.length})
        </h2>

        {quiz.questions.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No questions added yet</p>
            <p className="text-gray-400 mt-2">
              Add your first question to get started
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 mt-4 flex items-center mx-auto"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Question
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {quiz.questions.map((question, index) => (
              <div
                key={question.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                {editingQuestion?.id === question.id ? (
                  /* Edit Form */
                  <form onSubmit={handleEditQuestion} className="space-y-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">
                        Edit Question {index + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setEditingQuestion(null)}
                        className="text-gray-400 hover:text-gray-600"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>

                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => setEditingQuestion(null)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
                      >
                        {submitting ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Display Mode */
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-gray-900">
                        Question {index + 1}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingQuestion(question)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-800 mb-4">
                      {question.question_text}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {["A", "B", "C", "D"].map((option) => (
                        <div
                          key={option}
                          className={`p-2 rounded border ${
                            question.correct_option === option
                              ? "bg-green-50 border-green-200 text-green-800"
                              : "bg-gray-50 border-gray-200 text-gray-700"
                          }`}
                        >
                          <span className="font-medium">{option}.</span>{" "}
                          {
                            question[
                              `option_${option.toLowerCase()}` as keyof Question
                            ]
                          }
                          {question.correct_option === option && (
                            <span className="text-xs ml-2 font-medium">
                              (Correct)
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
