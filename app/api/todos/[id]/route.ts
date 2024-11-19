// app/api/todos/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await params to safely access `id`
    const { id } = await params;

    // Parse request body for fields to update
    const { title, completed } = await req.json();

    // Prepare update data dynamically
    const updateData: { title?: string; completed?: boolean } = {};
    if (title) updateData.title = title;
    if (completed !== undefined) updateData.completed = completed;

    // Update the task in the database
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json({ error: 'Failed to update Todo' }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const deletedTodo = await prisma.todo.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Todo deleted successfully', deletedTodo });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ message: 'Failed to delete todo', error: errorMessage }, { status: 500 });
  }
}
