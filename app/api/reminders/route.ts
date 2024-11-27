// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
// import { validatePhoneNumber } from '@/utils/validatePhone';

// export async function POST(req: NextRequest) {
//   try {
//     // const contentType = req.headers.get('content-type');
//     // // Ensure Content-Type is application/json
//     // if (!contentType || !contentType.includes('application/json')) {
//     //   return NextResponse.json(
//     //     { error: 'Invalid content type. Must be application/json' },
//     //     { status: 415 }
//     //   );
//     // }
//     const body = await req.json();
//     // // Validate the payload
//     // if (!body || typeof body !== 'object') {
//     //   return NextResponse.json(
//     //     { error: 'Payload must be a valid JSON object' },
//     //     { status: 400 }
//     //   );
//     // }
//     const { title, description = '', phoneNumber, userId, reminderTime} = body;
//     // Basic validation
//     if (!title || !phoneNumber || !userId || !reminderTime) {
//       return NextResponse.json(
//         { error: 'Missing required fields: title, phoneNumber, userId, reminderTime' },
//         { status: 400 }
//       );
//     }

//     // if (!validatePhoneNumber(phoneNumber)) {
//     //   return NextResponse.json(
//     //     { error: 'Invalid phone number format' },
//     //     { status: 400 }
//     //   );
//     // }

//     // Upsert Reminder
//     const reminder = await prisma.reminder.create({
//       data: {
//         title,
//         description,
//         phoneNumber,
//         reminderTime: new Date(reminderTime),
//         userId,
//       },
//     });

//     // console.log('Reminder created/updated:', reminder);

//     return NextResponse.json(
//       { success: true, reminder },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Error in POST /api/reminder:', error);

//     return NextResponse.json(
//       { error: 'Unexpected error', details: error || 'Unknown error' },
//       { status: 500 }
//     );
//   }
// }

// // GET method remains the same
// export async function GET(req: Request) {
//   try {
//     console.log('Received GET request');
    
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get('userId');
//     console.log('Querying for userId:', userId);

//     if (!userId) {
//       console.error('No userId provided');
//       return NextResponse.json({ 
//         error: 'User ID is required' 
//       }, { status: 400 });
//     }

//     const reminders = await prisma.reminder.findMany({
//       where: { userId },
//       orderBy: { reminderTime: 'asc' },
//     });

//     console.log(`Found ${reminders.length} reminders`);

//     return NextResponse.json({ 
//       success: true,
//       reminders 
//     });

//   } catch (error) {
//     console.error('Error in GET /api/reminder:', error);
//     return NextResponse.json({
//       error: 'Failed to fetch reminders',
//       details: error
//     }, { status: 500 });
//   }
// }

// import { NextResponse } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import twilio from "twilio";

// const accountSid = process.env.TWILIO_ACCOUNT_SID!;
// const authToken = process.env.TWILIO_AUTH_TOKEN!;
// const client = twilio(accountSid, authToken);

export async function POST(request: Request) {
  try {
    const { title, description, phoneNumber, reminderAt, userId } = await request.json();

    // Validate input
    if (!title || !description || !phoneNumber || !reminderAt || !userId) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Create reminder in the database
    const reminder = await prisma.reminder.create({
      data: {
        title,
        description,
        phoneNumber,
        reminderAt: new Date(reminderAt),
        userId,
      },
    });

    // Schedule SMS (for simplicity, immediate for now)
    // await client.messages.create({
    //   body: Reminder: ${title}\n\n${description},
    //   from: process.env.TWILIO_PHONE_NUMBER!,
    //   to: phoneNumber,
    // });

    return NextResponse.json({ reminder }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create reminder" }, { status: 500 });
  }
}