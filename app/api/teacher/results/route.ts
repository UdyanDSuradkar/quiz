// app/api/teacher/results/route.ts

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request: NextRequest) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("results")
    .select("id, score, total_questions, quiz_id, quizzes!inner (created_by)")
    .eq("quizzes.created_by", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Flatten out only results for quizzes created by this teacher
  return NextResponse.json(data || []);
}
