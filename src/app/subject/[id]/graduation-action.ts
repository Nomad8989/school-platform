"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { checkGraduationStatus } from "../graduation-action"; // 📍 Import your logic
// ... other imports

export default function GraduationPage() {
  const router = useRouter();
  const params = useParams();
  const subjectId = params?.id as string;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyEligibility() {
      // Assuming a standard course has 3 core units for now
      const isEligible = await checkGraduationStatus(subjectId, 3);
      
      if (!isEligible) {
        // 🛡️ Security Redirect: Not ready to graduate? Go back to class!
        router.push(`/subject/${subjectId}`);
      } else {
        setLoading(false);
        // Trigger confetti here...
      }
    }
    verifyEligibility();
  }, [subjectId, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white text-blue-600 font-black italic">
      VERIFYING CREDITS...
    </div>
  );

  // ... (Rest of your certificate UI code)
}