"use client";
import { useParams } from "next/navigation";
import CreateReminderForm from "../../../components/CreateReminderForm";
import Link from "next/link";

export default function CreateReminderPage() {
  const params = useParams();
  const userId = params.id as string;
  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create New Reminder</h1>
        <Link href={`/reminder/${userId}`}>
          <button >Back to Reminders</button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <CreateReminderForm  />
      </div>
    </main>
  );
}