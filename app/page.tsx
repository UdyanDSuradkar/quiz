import Link from "next/link";
import {
  BookOpen,
  Users,
  Award,
  Clock,
  CheckCircle,
  Target,
  ArrowRight,
  Play,
  Shield,
  Trophy,
  Star,
  TrendingUp,
  Sparkles,
  User,
  Edit,
  BarChart3,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 animate-bounce animation-delay-1000">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="absolute top-32 right-32 animate-bounce animation-delay-3000">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl">
              <Trophy className="h-8 w-8 text-yellow-300" />
            </div>
          </div>
          <div className="absolute bottom-32 left-32 animate-bounce animation-delay-5000">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl">
              <Target className="h-8 w-8 text-green-300" />
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 text-white/90 text-sm font-medium mb-8 animate-in slide-in-from-top duration-1000">
              <Sparkles className="h-4 w-4 mr-2" />
              Modern Quiz Platform for Education
            </div>

            {/* Main Headlines */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight animate-in slide-in-from-bottom duration-1000 animation-delay-500">
              Create & Take Quizzes
              <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed animate-in slide-in-from-bottom duration-1000 animation-delay-1000">
              The perfect platform for teachers to create engaging quizzes and
              students to test their knowledge. Role-based dashboards, instant
              results, and beautiful interface.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-in slide-in-from-bottom duration-1000 animation-delay-1500">
              <Link
                href="/auth/register"
                className="group bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-8 py-4 rounded-2xl text-lg shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/auth/login"
                className="group bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <User className="mr-2 h-5 w-5" />
                Sign In
              </Link>
            </div>

            {/* Feature Preview */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/60 animate-in slide-in-from-bottom duration-1000 animation-delay-2000">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <span className="text-sm">Teacher & Student Dashboards</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <span className="text-sm">Instant Quiz Results</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <span className="text-sm">Multiple Choice Questions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Transition */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="white"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section - Only Real Features */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-indigo-100 text-indigo-600 rounded-full px-6 py-2 text-sm font-medium mb-6">
              <Award className="h-4 w-4 mr-2" />
              Available Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
              Everything You Need for
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Quiz Learning
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features available right now to enhance your teaching and
              learning experience.
            </p>
          </div>

          {/* Features Grid - Real Features Only */}
          <div className="grid lg:grid-cols-2 gap-8 mb-20">
            {/* Teacher Dashboard */}
            <div className="group relative bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-100 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <User className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Teacher Dashboard
                </h3>
                <p className="text-gray-600 mb-6">
                  Create and manage quizzes, add questions with multiple choice
                  answers, and track student performance with detailed
                  analytics.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-indigo-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Create unlimited quizzes</span>
                  </div>
                  <div className="flex items-center text-sm text-indigo-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Add multiple choice questions</span>
                  </div>
                  <div className="flex items-center text-sm text-indigo-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>View student results</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Experience */}
            <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-100 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Student Experience
                </h3>
                <p className="text-gray-600 mb-6">
                  Browse available quizzes, take timed assessments, and get
                  instant results with detailed performance feedback.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Browse available quizzes</span>
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Timed quiz sessions</span>
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Instant score feedback</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quiz Management */}
            <div className="group relative bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 border border-yellow-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-yellow-100 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Edit className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Easy Quiz Creation
                </h3>
                <p className="text-gray-600 mb-6">
                  Simple interface to create quizzes with multiple subjects and
                  grades. Edit questions and manage quiz settings effortlessly.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-yellow-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Subject and grade organization</span>
                  </div>
                  <div className="flex items-center text-sm text-yellow-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Question editing tools</span>
                  </div>
                  <div className="flex items-center text-sm text-yellow-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Quiz settings management</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="group relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-100 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Results & Analytics
                </h3>
                <p className="text-gray-600 mb-6">
                  Track student performance, view detailed quiz statistics, and
                  monitor progress with comprehensive analytics dashboards.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-purple-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Performance tracking</span>
                  </div>
                  <div className="flex items-center text-sm text-purple-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Quiz statistics</span>
                  </div>
                  <div className="flex items-center text-sm text-purple-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Progress monitoring</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              How QuizLearn Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to get started with quiz creation and learning
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Sign Up & Choose Role
              </h3>
              <p className="text-gray-600">
                Register as a teacher or student and access your personalized
                dashboard with role-specific features.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Create or Take Quizzes
              </h3>
              <p className="text-gray-600">
                Teachers create quizzes with multiple choice questions. Students
                browse and take available quizzes.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                View Results
              </h3>
              <p className="text-gray-600">
                Get instant feedback with detailed results, scores, and
                performance analytics for continuous improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join teachers and students who are already using QuizLearn to
            enhance their educational experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              href="/auth/register"
              className="group bg-white text-indigo-600 font-black px-10 py-4 rounded-2xl text-lg shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              Get Started Free
              <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            </Link>
            <Link
              href="/auth/login"
              className="text-white font-bold px-8 py-4 rounded-2xl text-lg border-2 border-white/30 hover:bg-white/10 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>

          <p className="text-white/60 text-sm">
            Free to use • No setup required • Start creating quizzes immediately
          </p>
        </div>
      </section>
    </div>
  );
}
