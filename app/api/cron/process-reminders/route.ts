
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSMS } from '@/services/twilioService';

export async function GET() {
  try {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);

    const dueReminders = await prisma.reminder.findMany({
      where: {
        smsEnabled: true,
        smsSent: false,
        reminderTime: {
          gte: fiveMinutesAgo,
          lte: now
        }
      }
    });

    const results = await Promise.all(
      dueReminders.map(async (reminder) => {
        if (!reminder.phoneNumber) return null;

        const message = `Reminder: ${reminder.title}${
          reminder.description ? `\n${reminder.description}` : ''
        }`;

        const { success } = await sendSMS(reminder.phoneNumber, message);

        if (success) {
          await prisma.reminder.update({
            where: { id: reminder.id },
            data: { smsSent: true }
          });
        }

        return { id: reminder.id, success };
      })
    );

    return NextResponse.json({ processed: results.filter(Boolean) });
  } catch (error) {
    console.error('Failed to process reminders:', error);
    return NextResponse.json(
      { error: 'Failed to process reminders' },
      { status: 500 }
    );
  }
}