"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateAIInstruction(newValue: string) {
  const supabase = await createClient();

  // Update the row where the key is 'ai_instruction'
  const { error } = await supabase.from("school_settings").upsert(
    {
      setting_key: "ai_instruction",
      setting_value: newValue,
    },
    { onConflict: "setting_key" },
  );

  if (error) {
    console.error("Settings Update Error:", error.message);
    return { success: false };
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function getAIInstruction() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("school_settings")
    .select("setting_value")
    .eq("setting_key", "ai_instruction")
    .single();

  if (error) return "";
  return data.setting_value;
}
