import { createServerClient } from "./supabase/server";
import { redirect } from "next/navigation";

export async function getUser() {
  const supabase = createServerClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function getUserProfile(userId: string) {
  const supabase = createServerClient();

  const { data: profile, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Profile error:", error);
    return null;
  }

  return profile;
}

export async function requireAuth() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return user;
}
