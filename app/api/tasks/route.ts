import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { CreateTaskInput, UpdateTaskInput } from '@/lib/types';
import { TaskStatus } from '@prisma/client';

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
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' }, 
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const { 
      title, 
      priority = 3, 
      status = TaskStatus.PENDING 
    }: CreateTaskInput = await req.json();
    const newTask = await prisma.task.create({
      data: {
        title,
        priority,
        status,
        startTime: new Date(),
        endTime: status === TaskStatus.FINISHED ? new Date() : null,
        userId: user.id,
      }
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' }, 
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const { 
      id, 
      ...updateData 
    }: UpdateTaskInput = await req.json();

    const updatedTask = await prisma.task.update({
      where: { 
        id,
        userId: user.id 
      },
      data: {
        ...updateData,
        endTime: updateData.status === TaskStatus.FINISHED 
          ? new Date() 
          : undefined
      }
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const { ids }: { ids: number[] } = await req.json();

    await prisma.task.deleteMany({
      where: { 
        id: { in: ids },
        userId: user.id 
      }
    });

    return NextResponse.json(
      { message: 'Tasks deleted successfully' }
    );
  } catch (error) {
    console.error('Delete tasks error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' }, 
      { status: 500 }
    );
  }
}
