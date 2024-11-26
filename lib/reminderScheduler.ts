
import schedule from 'node-schedule';
import { sendMessage } from '@/utils/twilioClient';
import { prisma } from '@/lib/prisma';

const scheduledJobs = new Map();

export const scheduleReminder = async (
  id: string,
  title: string,
  description: string | null,
  phoneNumber: string,
  reminderTime: Date
) => {
  // Cancel existing job if updating
  if (scheduledJobs.has(id)) {
    scheduledJobs.get(id).cancel();
  }

  // Schedule new job
  const job = schedule.scheduleJob(reminderTime, async () => {
    try {
      const message = `Reminder: ${title}\n${description || ''}`;
      await sendMessage(phoneNumber, message);
      
      await prisma.reminder.update({
        where: { id },
        data: { sent: true },
      });
    } catch (error) {
      console.error('Failed to send reminder:', error);
    }
  });

  scheduledJobs.set(id, job);
};

export const cancelReminder = (id: string) => {
  if (scheduledJobs.has(id)) {
    scheduledJobs.get(id).cancel();
    scheduledJobs.delete(id);
  }
};
