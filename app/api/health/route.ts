// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { ReminderScheduler } from '@/services/schedulerService';

export async function GET() {
  try {
    const scheduler = ReminderScheduler.getInstance();
    const activeJobs = scheduler.getActiveJobsCount();
    
    return NextResponse.json({
      status: 'healthy',
      activeJobs,
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: error.message 
      },
      { status: 500 }
    );
  }
}