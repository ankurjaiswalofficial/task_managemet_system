"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/page-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TaskSummary, } from "@/lib/types";
import { Task } from "@prisma/client";

export default function DashboardPage() {
  const router = useRouter();
  const [pass, setPass] = useState(false);

  const [summary, setSummary] = useState<TaskSummary>({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    avgCompletionTime: "0 hrs",
  });
  const [taskDetails, setTaskDetails] = useState<Task[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    if (!token) {
      router.push("/");
      return;
    }

    fetch("/api/summary", {
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ email, token }),
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) =>{
        const completedTasks= parseInt(
          ((data.completedTasks / data.totalTasks) * 100).toFixed(2)
        )
        const pendingTasks = parseInt(
          ((data.pendingTasks / data.totalTasks) * 100).toFixed(2)
        )
        setSummary({
          totalTasks: data.totalTasks,
          completedTasks: isNaN(completedTasks) ? 0 : completedTasks,
          pendingTasks: isNaN(pendingTasks) ? 0 : pendingTasks,
          avgCompletionTime: `${data.avgCompletionTime} hrs`,
        })}
      )
      .catch((err) => console.error(err));

    fetch("/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setTaskDetails(data))
      .catch((err) => console.error(err));

    setPass(true);
  }, [router]);

  if (!pass) return <p>Loading...</p>;

  // Group tasks by priority
  const groupedTasks = taskDetails.reduce((acc, task) => {
    const priority = task.priority;
    if (!acc[priority]) acc[priority] = { pendingCount: 0, timeLapsed: 0, timeFinished: 0 };

    // Calculate time lapsed and time finished
    const startTime = new Date(task.startTime);
    const endTime = task.endTime ? new Date(task.endTime) : null;

    if (task.status === "PENDING") {
      acc[priority].pendingCount++;
      // Time lapsed for pending tasks (current time - start time)
      const timeLapsed = (new Date().getTime() - startTime.getTime()) / (1000 * 60 * 60); // in hours
      acc[priority].timeLapsed += timeLapsed;
    } else if (task.status === "FINISHED" && endTime) {
      // Time finished for completed tasks (end time - start time)
      const timeFinished = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); // in hours
      acc[priority].timeFinished += timeFinished;
    }
    return acc;
  }, {} as Record<number, { pendingCount: number; timeLapsed: number; timeFinished: number }>);

  return (
    <Layout>
      <div className="container py-10 space-y-8 mx-auto">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-4xl font-bold text-purple-600">
                {summary.totalTasks}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Total tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-4xl font-bold text-purple-600">
                {summary.completedTasks}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Tasks completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-4xl font-bold text-purple-600">
                {summary.pendingTasks}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Tasks pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-4xl font-bold text-purple-600">
                {summary.avgCompletionTime}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Average time per completed task
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Priority</TableHead>
                  <TableHead>Pending Tasks</TableHead>
                  <TableHead>Time Lapsed (hrs)</TableHead>
                  <TableHead>Time to Finish (hrs)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(groupedTasks).map(([priority, { pendingCount, timeLapsed, timeFinished }]) => (
                  <TableRow key={priority}>
                    <TableCell>{priority}</TableCell>
                    <TableCell>{pendingCount}</TableCell>
                    <TableCell>{timeLapsed.toFixed(2)}</TableCell>
                    <TableCell>{timeFinished.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
