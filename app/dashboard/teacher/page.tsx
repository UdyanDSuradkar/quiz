import { requireAuth, getUserProfile } from "@/app/lib/auth";
import TeacherDashboardClient from "@/app/components/TeacherDashboardClient";

export default async function TeacherDashboard() {
  const user = await requireAuth();
  const profile = await getUserProfile(user.id);

  if (profile?.role !== "teacher") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            This page is only accessible to teachers.
          </p>
        </div>
      </div>
    );
  }

  return <TeacherDashboardClient profile={profile} />;
}
