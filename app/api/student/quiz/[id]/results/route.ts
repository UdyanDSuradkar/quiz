import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
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

    // Get the quiz details
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select(
        `
        id,
        title,
        subject,
        grade,
        created_by,
        questions(
          id,
          question_text,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_option
        )
      `
      )
      .eq("id", id)
      .single();

    if (quizError || !quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Get teacher information
    const { data: teacher } = await supabase
      .from("users")
      .select("name")
      .eq("id", quiz.created_by)
      .single();

    // Get student's result for this quiz
    const { data: result, error: resultError } = await supabase
      .from("results")
      .select("*")
      .eq("user_id", user.id)
      .eq("quiz_id", id)
      .single();

    if (resultError || !result) {
      return NextResponse.json(
        { error: "No results found. Please take the quiz first." },
        { status: 404 }
      );
    }

    // Calculate detailed results (this would be better stored in the database for real apps)
    const detailedResults = quiz.questions.map((question) => ({
      question_id: question.id,
      question_text: question.question_text,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c,
      option_d: question.option_d,
      correct_option: question.correct_option,
      // For now, we can't show student's actual answers since we don't store them
      // In a real app, you'd store individual answers in a separate table
      student_answer: null,
      is_correct: null,
    }));

    return NextResponse.json({
      quiz: {
        id: quiz.id,
        title: quiz.title,
        subject: quiz.subject,
        grade: quiz.grade,
        teacher_name: teacher?.name || "Unknown Teacher",
      },
      result: {
        score: result.score,
        total_questions: result.total_questions,
        percentage: Math.round((result.score / result.total_questions) * 100),
        submitted_at: result.submitted_at,
      },
      detailed_results: detailedResults,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
