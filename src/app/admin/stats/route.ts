import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  // 1. Security Check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const adminEmail = "dash@edu.mn";

  if (!user || user.email !== adminEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Fetch all progress data
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .order("completed_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // 3. Group data by student
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

  return NextResponse.json({
    students: Object.values(studentMap),
    totalXp: totalSchoolXp,
  });
}
