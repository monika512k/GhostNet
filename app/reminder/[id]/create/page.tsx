// app/reminder/[userId]/create/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import CreateReminderForm from "../../../components/CreateReminderForm";
// import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreateReminderPage() {
  const params = useParams();
  const router = useRouter();

  const userId = params.id as string;
  console.log(params);

  const handleReminderCreated = () => {
    // Redirect to the reminders list page after creation
    router.push(`/reminder/${userId}`);
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create New Reminder</h1>
        <Link href={`/reminder/${userId}`}>
          <button variant="outline">Back to Reminders</button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <CreateReminderForm 
        
        />
      </div>
    </main>
  );
}