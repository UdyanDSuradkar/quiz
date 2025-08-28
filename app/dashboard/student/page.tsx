import { requireAuth, getUserProfile } from "@/app/lib/auth";
import StudentDashboardClient from "@/app/components/StudentDashboardClient";
export const dynamic = "force-dynamic";

export default async function StudentDashboard() {
  const user = await requireAuth();
  const profile = await getUserProfile(user.id);

  if (profile?.role !== "student") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            This page is only accessible to students.
          </p>
        </div>
      </div>
    );
  }

  return <StudentDashboardClient profile={profile} />;
}
