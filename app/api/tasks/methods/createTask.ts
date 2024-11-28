import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createTask(body: any) {
  const { title, startTime, endTime, priority, status, userId } = body;

  if (!title || !startTime || !endTime || !priority || !userId) {
    return { status: 400, data: { error: "Missing required fields" } };
  }

  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        priority,
        status,
        userId,
      },
    });
    return { status: 201, data: newTask };
  } catch (error) {
    console.error("Error creating task:", error);
    return { status: 500, data: { error: "Internal Server Error" } };
  }
}
