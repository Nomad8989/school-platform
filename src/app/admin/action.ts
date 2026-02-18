"use server";

import { createClient } from "@/utils/supabase/server";

export async function getAdminStats() {
  const supabase = await createClient();

  // 1. Get all progress records
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .order("completed_at", { ascending: false });

  if (error) return { students: [], totalXp: 0 };

  // 2. Process data to group by student
  const studentMap: Record<string, any> = {};
  let totalSchoolXp = 0;

  data.forEach((record) => {
    totalSchoolXp += record.xp_earned;
    if (!studentMap[record.user_id]) {
      studentMap[record.user_id] = {
        id: record.user_id,
        unitsCompleted: 0,
        totalXp: 0,
        lastActive: record.completed_at,
      };
    }
    studentMap[record.user_id].unitsCompleted += 1;
    studentMap[record.user_id].totalXp += record.xp_earned;
  });

  return {
    students: Object.values(studentMap),
    totalXp: totalSchoolXp,
  };
}
