import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    const { title, description, phoneNumber, reminderAt, userId } = await request.json();
    if (!title || !description || !phoneNumber || !reminderAt || !userId) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    const reminder = await prisma.reminder.create({
      data: {
        title,
        description,
        phoneNumber,
        reminderAt: new Date(reminderAt),
        userId,
      },
    });
    return NextResponse.json({ reminder }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create reminder" }, { status: 500 });
  }
}