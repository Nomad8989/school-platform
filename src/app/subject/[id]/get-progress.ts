"use server";

import { createClient } from "@/utils/supabase/server";

export async function getSubjectData(subjectId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user, return empty defaults so the app doesn't crash
  if (!user) return { completedUnits: [], mistakeCount: 0 };

  // 1. Fetch completed units for the Progress Map
  const { data: progress, error: progressError } = await supabase
    .from("user_progress")
    .select("unit_id")
    .eq("user_id", user.id)
    .eq("subject_id", subjectId);

  if (progressError)
    console.error("Progress Fetch Error:", progressError.message);

  // 2. Fetch mistakes count for the "Review Brain" icon
  const { count: mistakeCount, error: mistakeError } = await supabase
    .from("student_mistakes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("subject_id", subjectId);

  if (mistakeError) console.error("Mistake Fetch Error:", mistakeError.message);

  return {
    completedUnits: progress?.map((item) => item.unit_id) || [],
    mistakeCount: mistakeCount || 0,
  };
}
