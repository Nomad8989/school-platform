"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveProgress(
  subjectId: string,
  unitId: number,
  xp: number,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No user found" };

  const { error } = await supabase.from("user_progress").insert({
    user_id: user.id,
    subject_id: subjectId,
    unit_id: unitId,
    xp_earned: xp,
  });

  if (error) return { error: error.message };

  // This tells the "Winding Path" to update itself
  revalidatePath(`/subject/${subjectId}`);
  return { success: true };
}
