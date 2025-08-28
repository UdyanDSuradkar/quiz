"use client";

import { useState, useEffect } from "react";
import {
  X,
  Save,
  Edit3,
  BookOpen,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Quiz {
  id: string;
  title: string;
  subject: string;
  grade: string;
}

interface EditQuizModalProps {
  isOpen: boolean;
  quiz: Quiz | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditQuizModal({
  isOpen,
  quiz,
  onClose,
  onSuccess,
}: EditQuizModalProps) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (quiz) {
      setTitle(quiz.title);
      setSubject(quiz.subject);
      setGrade(quiz.grade);
    }
  }, [quiz]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quiz) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/quizzes/${quiz.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, subject, grade }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update quiz");
      }

      // 🎉 Success toast
      toast.success("Quiz updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      // ❌ Error toast
      toast.error(error.message || "Failed to update quiz", {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !quiz) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
        {/* Enhanced Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white rounded-t-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                <Edit3 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Edit Quiz</h2>
                <p className="text-indigo-100 text-sm">
                  Update quiz information
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Enhanced Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Quiz Title */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <BookOpen className="h-4 w-4 mr-2 text-indigo-600" />
              Quiz Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
              placeholder="Enter quiz title"
              required
            />
            <p className="text-xs text-gray-500">
              Update the title to better describe your quiz
            </p>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <GraduationCap className="h-4 w-4 mr-2 text-purple-600" />
              Subject *
            </label>
            <div className="relative">
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 appearance-none bg-white cursor-pointer"
                required
              >
                <option value="">Select subject</option>
                <option value="Mathematics">📊 Mathematics</option>
                <option value="Science">🔬 Science</option>
                <option value="English">📚 English</option>
                <option value="History">🏛️ History</option>
                <option value="Geography">🌍 Geography</option>
                <option value="Computer Science">💻 Computer Science</option>
                <option value="Social Studies">👥 Social Studies</option>
                <option value="Physics">⚛️ Physics</option>
                <option value="Chemistry">🧪 Chemistry</option>
                <option value="Biology">🧬 Biology</option>
                <option value="Economics">💰 Economics</option>
                <option value="Physical Education">
                  🏃‍♂️ Physical Education
                </option>
                <option value="Other">✨ Other</option>
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

          {/* Grade */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <span className="text-green-600 mr-2">🎓</span>
              Grade/Class *
            </label>
            <div className="relative">
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 appearance-none bg-white cursor-pointer"
                required
              >
                <option value="">Select grade level</option>
                <option value="1">Grade 1 (Ages 6-7)</option>
                <option value="2">Grade 2 (Ages 7-8)</option>
                <option value="3">Grade 3 (Ages 8-9)</option>
                <option value="4">Grade 4 (Ages 9-10)</option>
                <option value="5">Grade 5 (Ages 10-11)</option>
                <option value="6">Grade 6 (Ages 11-12)</option>
                <option value="7">Grade 7 (Ages 12-13)</option>
                <option value="8">Grade 8 (Ages 13-14)</option>
                <option value="9">Grade 9 (Ages 14-15)</option>
                <option value="10">Grade 10 (Ages 15-16)</option>
                <option value="11">Grade 11 (Ages 16-17)</option>
                <option value="12">Grade 12 (Ages 17-18)</option>
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-200 border border-gray-300 hover:shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Updating Quiz...
                </div>
              ) : (
                <div className="flex items-center">
                  <Save className="h-5 w-5 mr-2" />
                  Update Quiz
                </div>
              )}
            </button>
          </div>
        </form>

        {/* Footer Note */}
        <div className="px-6 pb-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Sparkles className="h-5 w-5 text-indigo-600 mt-0.5" />
              </div>
              <div>
                <p className="text-sm text-indigo-800 font-medium">Quick Tip</p>
                <p className="text-sm text-indigo-600 mt-1">
                  Changes will be saved immediately. Your existing questions
                  will remain unchanged.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
