"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * 💾 Saves the AI Teacher's "Personality" instructions to Supabase
 */
export async function updateAIInstruction(instruction: string) {
  const supabase = await createClient();

  // 1. Security Check: Only dash@edu.mn can save settings
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user?.email !== "dash@edu.mn") {
    return { success: false, error: "Unauthorized" };
  }

  // 2. Update the "Brain" in the database
  const { error } = await supabase.from("school_settings").upsert(
    {
      setting_key: "ai_instruction",
      setting_value: instruction,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "setting_key" },
  );

  if (error) {
    console.error("Settings Update Error:", error.message);
    return { success: false, error: error.message };
  }

  // 3. Refresh the cache so the Admin page and AI API see the change
  revalidatePath("/admin");
  return { success: true };
}

/**
 * 🔍 Fetches the current AI Teacher instructions
 */
export async function getAIInstruction() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("school_settings")
    .select("setting_value")
    .eq("setting_key", "ai_instruction")
    .single();

  if (error || !data) return "You are a helpful teacher at Gegee School.";
  return data.setting_value;
}
