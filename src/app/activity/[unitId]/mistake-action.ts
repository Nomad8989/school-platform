"use server";

import { createClient } from "@/utils/supabase/server";

export async function logMistake(word: string, subjectId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // 1. Check if mistake exists
  const { data: existing } = await supabase
    .from("student_mistakes")
    .select("error_count")
    .eq("user_id", user.id)
    .eq("word_or_phrase", word)
    .single();

  const newCount = existing ? existing.error_count + 1 : 1;

  // 2. Update database
  await supabase.from("student_mistakes").upsert(
    {
      user_id: user.id,
      word_or_phrase: word,
      subject_id: subjectId,
      error_count: newCount,
      last_missed: new Date().toISOString(),
    },
    { onConflict: "user_id, word_or_phrase" },
  );
}
