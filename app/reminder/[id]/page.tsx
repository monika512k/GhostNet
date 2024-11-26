"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation"; // Corrected import
import { useState, useEffect } from "react";

export default function ReminderPage() {
  const params = useParams();
  const userId = params.id as string;
  const router = useRouter();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleNavigate = (id: string) => {
    // Navigate to a specific page with query params
    router.push(`/reminder/${userId}/create?id=${id}`);
  };

  useEffect(() => {
    async function fetchReminders() {
      try {
        const response = await fetch(`/api/reminder?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch reminders');
        }
        const data = await response.json();
        setReminders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reminders');
      } finally {
        setLoading(false);
      }
    }

    fetchReminders();
  }, [userId]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Reminders</h1>
      <div className="space-y-4">
        {reminders.map((reminder: any) => (
          <div key={reminder.id} className="p-4 border rounded-lg shadow">
            <h3 className="font-semibold">{reminder.title}</h3>
            <p className="text-gray-600">{reminder.description}</p>
            <p>{new Date(reminder.reminderTime).toLocaleString()}</p>
            <button onClick={() => handleNavigate(reminder.id)} className="mt-2 text-blue-500 underline">
              Go to edit
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
