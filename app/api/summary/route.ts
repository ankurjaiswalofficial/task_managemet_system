import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const totalTasks = await prisma.task.count();
    const completedTasks = await prisma.task.count({ where: { status: "FINISHED" } });
    const pendingTasks = await prisma.task.count({ where: { status: "PENDING" } });

    // Fetch all completed tasks to calculate average completion time
    const completedTaskDurations = await prisma.task.findMany({
      where: { status: "FINISHED" },
      select: { startTime: true, endTime: true },
    });

    // Calculate average time in hours
    let avgCompletionTime = null;
    if (completedTaskDurations.length > 0) {
      const totalDurationInHours = completedTaskDurations.reduce((acc, task) => {
        if (task.startTime && task.endTime) {
          const duration = (task.endTime.getTime() - task.startTime.getTime()) / (1000 * 60 * 60); // Convert milliseconds to hours
          return acc + duration;
        }
        return acc;
      }, 0);

      avgCompletionTime = totalDurationInHours / completedTaskDurations.length;
    }

    return NextResponse.json(
      {
        totalTasks,
        completedTasks,
        pendingTasks,
        avgCompletionTime: avgCompletionTime ? `${avgCompletionTime.toFixed(2)} hrs` : "N/A",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching summary:", error);
    return NextResponse.json({ error: "Failed to fetch summary" }, { status: 500 });
  }
}
