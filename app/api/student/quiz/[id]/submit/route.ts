import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export async function POST(
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

    const body = await request.json();
    const { answers } = body; // answers should be { questionId: selectedOption }

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "Invalid answers format" },
        { status: 400 }
      );
    }

    // Get the quiz with all questions and correct answers
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select(
        `
        id,
        title,
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

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;
    const detailedResults = [];

    for (const question of quiz.questions) {
      const studentAnswer = answers[question.id];
      const isCorrect = studentAnswer === question.correct_option;

      if (isCorrect) {
        correctAnswers++;
      }

      detailedResults.push({
        question_id: question.id,
        question_text: question.question_text,
        option_a: question.option_a,
        option_b: question.option_b,
        option_c: question.option_c,
        option_d: question.option_d,
        correct_option: question.correct_option,
        student_answer: studentAnswer || null,
        is_correct: isCorrect,
      });
    }

    // Check if student has already submitted this quiz - FIXED: Use maybeSingle
    const { data: existingResult, error: checkError } = await supabase
      .from("results")
      .select("id")
      .eq("user_id", user.id)
      .eq("quiz_id", id)
      .maybeSingle(); // ✅ Use maybeSingle instead of single to avoid error on no rows

    let result;
    if (existingResult) {
      // Update existing result - FIXED: Added .select()
      const { data: updatedResult, error: updateError } = await supabase
        .from("results")
        .update({
          score: correctAnswers,
          total_questions: totalQuestions,
          submitted_at: new Date().toISOString(),
        })
        .eq("id", existingResult.id)
        .select() // ✅ CRITICAL: Must add .select() to get updated data back
        .single();

      if (updateError) {
        console.error("Error updating result:", updateError);
        return NextResponse.json(
          { error: "Failed to update result" },
          { status: 500 }
        );
      }
      result = updatedResult;
    } else {
      // Create new result
      const { data: newResult, error: insertError } = await supabase
        .from("results")
        .insert([
          {
            user_id: user.id,
            quiz_id: id,
            score: correctAnswers,
            total_questions: totalQuestions,
            submitted_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Error creating result:", insertError);
        return NextResponse.json(
          { error: "Failed to save result" },
          { status: 500 }
        );
      }
      result = newResult;
    }

    // Return the results
    return NextResponse.json({
      result_id: result.id,
      score: correctAnswers,
      total_questions: totalQuestions,
      percentage: Math.round((correctAnswers / totalQuestions) * 100),
      quiz_title: quiz.title,
      detailed_results: detailedResults,
      submitted_at: result.submitted_at,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
