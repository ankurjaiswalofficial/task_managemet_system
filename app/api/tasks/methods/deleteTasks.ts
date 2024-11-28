import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function deleteTasks(body: any) {
  const { ids } = body;

  if (!ids || !Array.isArray(ids)) {
    return { status: 400, data: { error: "Invalid request body" } };
  }

  try {
    await prisma.task.deleteMany({
      where: { id: { in: ids } },
    });
    return { status: 200, data: { message: "Tasks deleted successfully" } };
  } catch (error) {
    console.error("Error deleting tasks:", error);
    return { status: 500, data: { error: "Internal Server Error" } };
  }
}
