import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Ensure that you're using the params.id correctly
    const reminder = await prisma.reminder.findUnique({
      where: {
        id: params.id,  // Use params.id to get the reminder by id
      },
    });

    // Check if reminder is found
    if (!reminder) {
      return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
    }

    return NextResponse.json(reminder, { status: 200 }); // Return the reminder
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}


// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params;

//     // Cancel scheduled job
//     if (scheduledJobs.has(id)) {
//       scheduledJobs.get(id).cancel();
//       scheduledJobs.delete(id);
//     }

//     // Delete from database
//     await prisma.reminder.delete({
//       where: { id },
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to delete reminder' },
//       { status: 500 }
//     );
//   }
// }
