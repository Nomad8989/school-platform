import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  // 1. SECURITY CHECK: Only allow Dash
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const adminEmail = "dash@edu.mn";

  if (!user || user.email !== adminEmail) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 401 });
  }

  // 2. FETCH ALL STUDENT PROGRESS
  const { data: progressData, error: progressError } = await supabase
    .from("user_progress")
    .select("*")
    .order("completed_at", { ascending: false });

  if (progressError)
    return NextResponse.json({ error: progressError.message }, { status: 500 });

  // 3. FETCH TOP MISTAKES (SCHOOL-WIDE)
  // We grab the mistakes and count the frequency of each word/phrase
  const { data: mistakeData } = await supabase
    .from("student_mistakes")
    .select("word_or_phrase");

  const mistakeCounts: Record<string, number> = {};
  mistakeData?.forEach((m) => {
    mistakeCounts[m.word_or_phrase] =
      (mistakeCounts[m.word_or_phrase] || 0) + 1;
  });

  // Convert to sorted array of top 5 most common errors
  const commonMistakes = Object.entries(mistakeCounts)
    .map(([word_or_phrase, count]) => ({ word_or_phrase, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 4. DATA OPTIMIZATION: Progress Grouping
  const studentMap: Record<string, any> = {};
  let totalSchoolXp = 0;

  progressData.forEach((record) => {
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

  return NextResponse.json({
    students: Object.values(studentMap),
    totalXp: totalSchoolXp,
    commonMistakes: commonMistakes, // 📍 Now the Dashboard can see the struggles!
  });
}
