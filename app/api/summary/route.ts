import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { TaskStatus } from '@prisma/client';
import { TaskSummary } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const tasks = await prisma.task.findMany({
      where: { userId: user.id }
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      task => task.status === TaskStatus.FINISHED
    ).length;
    const pendingTasks = tasks.filter(
      task => task.status === TaskStatus.PENDING
    ).length;
    
    const finishedTasks = tasks.filter(
      task => task.status === TaskStatus.FINISHED
    );
    
    const avgCompletionTime = finishedTasks.length 
      ? finishedTasks.reduce((acc, task) => {
          const duration = task.endTime 
            ? (task.endTime.getTime() - task.startTime.getTime()) / (1000 * 60 * 60)
            : 0;
          return acc + duration;
        }, 0) / finishedTasks.length
      : 0;

    const summary: TaskSummary = {
      totalTasks,
      completedTasks,
      pendingTasks,
      avgCompletionTime: avgCompletionTime.toFixed(2)
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Summary error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' }, 
      { status: 500 }
    );
  }
}
