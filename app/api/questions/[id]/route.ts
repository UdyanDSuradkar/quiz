import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export async function PUT(
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

    const body = await request.json();
    const {
      question_text,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option,
    } = body;

    // Verify the question belongs to the user's quiz
    const { data: question } = await supabase
      .from("questions")
      .select(
        `
        *,
        quizzes!inner(created_by)
      `
      )
      .eq("id", id)
      .single();

    if (!question || question.quizzes.created_by !== user.id) {
      return NextResponse.json(
        { error: "Question not found or unauthorized" },
        { status: 404 }
      );
    }

    const { data: updatedQuestion, error } = await supabase
      .from("questions")
      .update({
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_option,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating question:", error);
      return NextResponse.json(
        { error: "Failed to update question" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Verify the question belongs to the user's quiz
    const { data: question } = await supabase
      .from("questions")
      .select(
        `
        *,
        quizzes!inner(created_by)
      `
      )
      .eq("id", id)
      .single();

    if (!question || question.quizzes.created_by !== user.id) {
      return NextResponse.json(
        { error: "Question not found or unauthorized" },
        { status: 404 }
      );
    }

    const { error } = await supabase.from("questions").delete().eq("id", id);

    if (error) {
      console.error("Error deleting question:", error);
      return NextResponse.json(
        { error: "Failed to delete question" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
