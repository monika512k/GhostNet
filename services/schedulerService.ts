import { prisma } from '@/lib/prisma';
import { sendSMS } from './twilioService';
import * as cron from 'node-cron';

export class ReminderScheduler {
  private static instance: ReminderScheduler;
  private activeJobs: Map<string, cron.ScheduledTask>;

  private constructor() {
    this.activeJobs = new Map();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ReminderScheduler();
    }
    return this.instance;
  }

  async scheduleReminder(reminderId: string) {
    const reminder = await prisma.reminder.findUnique({
      where: { id: reminderId }
    });

    if (!reminder || !reminder.phoneNumber || !reminder.smsEnabled) {
      return;
    }

    // Cancel existing job if any
    this.cancelReminder(reminderId);

    const scheduledTime = new Date(reminder.reminderTime);
    if (scheduledTime <= new Date()) {
      return; // Don't schedule if time has passed
    }

    // Create cron schedule
    const cronSchedule = `${scheduledTime.getMinutes()} ${scheduledTime.getHours()} ${scheduledTime.getDate()} ${scheduledTime.getMonth() + 1} *`;

    const job = cron.schedule(cronSchedule, async () => {
      try {
        const message = `Reminder: ${reminder.title}${
          reminder.description ? `\n${reminder.description}` : ''
        }`;

        const { success } = await sendSMS(reminder.phoneNumber!, message);

        if (success) {
          await prisma.reminder.update({
            where: { id: reminder.id },
            data: { smsSent: true }
          });
        }

        // Clean up the job after execution
        this.cancelReminder(reminderId);
      } catch (error) {
        console.error(`Failed to send reminder ${reminderId}:`, error);
      }
    });

    this.activeJobs.set(reminderId, job);
  }

  cancelReminder(reminderId: string) {
    const job = this.activeJobs.get(reminderId);
    if (job) {
      job.stop();
      this.activeJobs.delete(reminderId);
    }
  }

  // Load all pending reminders on startup
  async loadPendingReminders() {
    const pendingReminders = await prisma.reminder.findMany({
      where: {
        smsEnabled: true,
        smsSent: false,
        reminderTime: {
          gt: new Date()
        }
      }
    });

    for (const reminder of pendingReminders) {
      await this.scheduleReminder(reminder.id);
    }
  }
}
