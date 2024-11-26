"use client";

import { useState } from "react";

export default function ReminderForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    phoneNumber: "",
    reminderAt: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId: "current-user-id" }), // Replace with auth user ID
      });

      if (res.ok) {
        setMessage("Reminder created successfully!");
        setFormData({ title: "", description: "", phoneNumber: "", reminderAt: "" });
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to create reminder");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
        className="input"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
        className="textarea"
      />
      <input
        type="text"
        name="phoneNumber"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={handleChange}
        required
        className="input"
      />
      <input
        type="datetime-local"
        name="reminderAt"
        value={formData.reminderAt}
        onChange={handleChange}
        required
        className="input"
      />
      <button type="submit" disabled={loading} className="button">
        {loading ? "Creating..." : "Create Reminder"}
      </button>
      {message && <p className="message">{message}</p>}
    </form>
  );
}