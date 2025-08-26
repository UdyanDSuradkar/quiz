import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      quiz_id,
      question_text,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option,
    } = body;

    // Verify the quiz belongs to the user
    const { data: quiz } = await supabase
      .from("quizzes")
      .select("id")
      .eq("id", quiz_id)
      .eq("created_by", user.id)
      .single();

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz not found or unauthorized" },
        { status: 404 }
      );
    }

    const { data: question, error } = await supabase
      .from("questions")
      .insert([
        {
          quiz_id,
          question_text,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_option,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating question:", error);
      return NextResponse.json(
        { error: "Failed to create question" },
        { status: 500 }
      );
    }

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
