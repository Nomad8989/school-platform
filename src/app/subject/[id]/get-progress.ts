"use server";

import { createClient } from "@/utils/supabase/server";

export async function getSubjectProgress(subjectId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("user_progress")
    .select("unit_id")
    .eq("user_id", user.id)
    .eq("subject_id", subjectId);

  if (error) {
    console.error("Fetch Error:", error);
    return [];
  }

  // Return just an array of numbers like [1, 2]
  return data.map((item) => item.unit_id);
}
