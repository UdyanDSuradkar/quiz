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

    // 🔍 DEBUG LOGGING - Add these to see what's happening
    console.log("🔍 Debug Info:");
    console.log("Quiz ID:", id);
    console.log("User ID:", user?.id);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user is a teacher and owns this quiz
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select("id, title, subject, grade, created_by")
      .eq("id", id)
      .eq("created_by", user.id)
      .single();

    console.log("Quiz found:", quiz);
    console.log("Quiz error:", quizError);

    if (quizError || !quiz) {
      return NextResponse.json(
        { error: "Quiz not found or unauthorized" },
        { status: 404 }
      );
    }

    // Get all results for this quiz with student information - FIXED JOIN SYNTAX
    const { data: results, error: resultsError } = await supabase
      .from("results")
      .select(
        `
        id,
        score,
        total_questions,
        submitted_at,
        user_id,
        users (
          id,
          name,
          email
        )
      `
      )
      .eq("quiz_id", id)
      .order("submitted_at", { ascending: false });

    console.log("Results raw data:", results);
    console.log("Results error:", resultsError);
    console.log("Results count:", results?.length);

    if (results && results.length > 0) {
      console.log(
        "First result structure:",
        JSON.stringify(results[0], null, 2)
      );
    }

    if (resultsError) {
      console.error("Error fetching results:", resultsError);
      return NextResponse.json(
        { error: "Failed to fetch results" },
        { status: 500 }
      );
    }

    // Calculate analytics
    const totalAttempts = results.length;
    const averageScore =
      totalAttempts > 0
        ? results.reduce((sum, result) => sum + result.score, 0) / totalAttempts
        : 0;
    const averagePercentage =
      totalAttempts > 0
        ? results.reduce(
            (sum, result) =>
              sum + (result.score / result.total_questions) * 100,
            0
          ) / totalAttempts
        : 0;
    const highestScore =
      totalAttempts > 0
        ? Math.max(...results.map((result) => result.score))
        : 0;
    const lowestScore =
      totalAttempts > 0
        ? Math.min(...results.map((result) => result.score))
        : 0;

    // Format results with percentages - FIXED USER MAPPING
    const formattedResults = results.map((result) => ({
      id: result.id,
      student_name: result.users?.[0]?.name ?? "Unknown",
      student_email: result.users?.[0]?.email ?? "Unknown",
      score: result.score,
      total_questions: result.total_questions,
      percentage: Math.round((result.score / result.total_questions) * 100),
      submitted_at: result.submitted_at,
    }));

    console.log("Formatted results:", formattedResults);

    return NextResponse.json({
      quiz: {
        id: quiz.id,
        title: quiz.title,
        subject: quiz.subject,
        grade: quiz.grade,
      },
      analytics: {
        total_attempts: totalAttempts,
        average_score: Math.round(averageScore * 10) / 10,
        average_percentage: Math.round(averagePercentage * 10) / 10,
        highest_score: highestScore,
        lowest_score: lowestScore,
        total_questions: results[0]?.total_questions || 0,
      },
      results: formattedResults,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
