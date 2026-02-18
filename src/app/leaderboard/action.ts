"use server";

import { createClient } from "@/utils/supabase/server";

export async function getLeaderboardData() {
  const supabase = await createClient();

  // This query sums up all XP for each user and joins with their profile name
  const { data, error } = await supabase.from("user_progress").select(`
      xp_earned,
      user_id
    `);

  if (error) return [];

  // Grouping the data by User (since Supabase doesn't sum automatically in a simple select)
  const totals: Record<string, number> = {};
  data.forEach((item) => {
    totals[item.user_id] = (totals[item.user_id] || 0) + item.xp_earned;
  });

  // Convert to array and sort
  const leaderboard = Object.entries(totals)
    .map(([userId, totalXp]) => ({ userId, totalXp }))
    .sort((a, b) => b.totalXp - a.totalXp);

  return leaderboard.slice(0, 10); // Top 10 students
}
