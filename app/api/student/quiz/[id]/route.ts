import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ Correct - await the params Promise
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user is a student
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "student") {
      return NextResponse.json(
        { error: "Access denied. Students only." },
        { status: 403 }
      );
    }

    // Get the quiz with all questions (but without correct answers for security)
    const { data: quiz, error } = await supabase
      .from("quizzes")
      .select(
        `
        id,
        title,
        subject,
        grade,
        created_by,
        created_at,
        questions(
          id,
          question_text,
          option_a,
          option_b,
          option_c,
          option_d
        )
      `
      )
      .eq("id", id)
      .single();

    if (error || !quiz) {
      console.error("Quiz fetch error:", error);
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Check if quiz has questions
    if (!quiz.questions || quiz.questions.length === 0) {
      return NextResponse.json(
        { error: "Quiz has no questions" },
        { status: 400 }
      );
    }

    // Get teacher information
    const { data: teacher } = await supabase
      .from("users")
      .select("name")
      .eq("id", quiz.created_by)
      .single();

    // Check if student has already attempted this quiz
    const { data: previousResult } = await supabase
      .from("results")
      .select("score, submitted_at")
      .eq("user_id", user.id)
      .eq("quiz_id", id)
      .single();

    return NextResponse.json({
      ...quiz,
      teacher_name: teacher?.name || "Unknown Teacher",
      previous_attempt: previousResult
        ? {
            score: previousResult.score,
            submitted_at: previousResult.submitted_at,
          }
        : null,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
