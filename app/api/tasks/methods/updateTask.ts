import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function updateTask(body: any) {
  const { id, title, startTime, endTime, priority, status, userId } = body;

  if (!id || !title || !startTime || !endTime || !priority || !userId) {
    return { status: 400, data: { error: "Missing required fields" } };
  }

  try {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        priority,
        status,
        userId,
      },
    });
    return { status: 200, data: updatedTask };
  } catch (error) {
    console.error("Error updating task:", error);
    return { status: 500, data: { error: "Internal Server Error" } };
  }
}
