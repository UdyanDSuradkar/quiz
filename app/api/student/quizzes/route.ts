import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request: NextRequest) {
  try {
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

    // Fetch all quizzes with their question counts and teacher info
    // Only get quizzes that have at least one question
    const { data: quizzes, error: quizError } = await supabase
      .from("quizzes")
      .select(
        `
        *,
        questions(count),
        users!quizzes_created_by_fkey(
          name,
          email
        )
      `
      )
      .not("questions", "is", null)
      .order("created_at", { ascending: false });

    if (quizError) {
      console.error("Error fetching quizzes for student:", quizError);
      return NextResponse.json(
        { error: "Failed to fetch quizzes" },
        { status: 500 }
      );
    }

    // Filter quizzes that have questions
    const availableQuizzes = quizzes.filter(
      (quiz) =>
        quiz.questions &&
        quiz.questions.length > 0 &&
        quiz.questions[0].count > 0
    );

    // Get student's quiz results
    const { data: results, error: resultsError } = await supabase
      .from("results")
      .select("quiz_id, score, submitted_at")
      .eq("user_id", user.id);

    if (resultsError) {
      console.error("Error fetching quiz results for student:", resultsError);
      return NextResponse.json(
        { error: "Failed to fetch quiz results" },
        { status: 500 }
      );
    }

    // Add attempt status to each quiz
    const quizzesWithStatus = availableQuizzes.map((quiz) => ({
      ...quiz,
      // Teacher info from the joined users array
      teacher_name: quiz.users?.[0]?.name ?? "Unknown Teacher",
      teacher_email: quiz.users?.[0]?.email ?? "",
      attempted: results?.some((result) => result.quiz_id === quiz.id) || false,
      lastScore: results?.find((result) => result.quiz_id === quiz.id)?.score,
      lastAttempt: results?.find((result) => result.quiz_id === quiz.id)
        ?.submitted_at,
      questionCount: quiz.questions?.[0]?.count ?? 0,
    }));

    return NextResponse.json(quizzesWithStatus);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
