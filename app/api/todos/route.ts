// app/api/todos/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { title, userId } = await req.json();
    const newTodo = await prisma.todo.create({
      data: {
        title,
        userId,
      },
    });
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create Todo' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Extract the userId from the query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId query parameter' }, { status: 400 });
    }

    // Fetch todos for the given userId
    const todos = await prisma.todo.findMany({
      where: {
        userId,
      },
    });

    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch Todos' }, { status: 500 });
  }
}