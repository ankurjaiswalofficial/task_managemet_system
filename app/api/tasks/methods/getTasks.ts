import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getTasks() {
  try {
    const tasks = await prisma.task.findMany({
      include: { user: { select: { email: true } } }, // Optionally include user info
    });
    return { status: 200, data: tasks };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { status: 500, data: { error: "Internal Server Error" } };
  }
}
