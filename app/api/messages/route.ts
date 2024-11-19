/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '@/lib/prisma';
import { pusher } from '@/lib/pusher';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const senderId = searchParams.get('senderId');
  const receiverId = searchParams.get('receiverId');

  if (!senderId || !receiverId) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { 
            AND: [
              { senderId: senderId },
              { receiverId: receiverId }
            ]
          },
          {
            AND: [
              { senderId: receiverId },
              { receiverId: senderId }
            ]
          }
        ]
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { content, senderId, receiverId } = await request.json();

    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
      },
    });

    // Trigger Pusher events
    pusher.trigger(`chat-${senderId}-${receiverId}`, 'new-message', message);
    pusher.trigger(`chat-${receiverId}-${senderId}`, 'new-message', message);

    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}