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
import { TaskSummary, TaskDetail } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [pass, setPass] = useState(false);

  const [summary, setSummary] = useState<TaskSummary>({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    avgCompletionTime: "0 hrs",
  });
  const [taskDetails, setTaskDetails] = useState<TaskDetail[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    console.log(token);
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
      .then((data) =>
        setSummary({
          totalTasks: data.totalTasks,
          completedTasks: parseInt(((data.completedTasks / data.totalTasks) * 100).toFixed(2)),
          pendingTasks: parseInt(((data.pendingTasks / data.totalTasks) * 100).toFixed(2)),
          avgCompletionTime: `${data.avgCompletionTime} hrs`,
        })
      )
      .catch((err) => console.error(err));

    fetch("/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ email, token }),
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => setTaskDetails(data))
      .catch((err) => console.error(err));
    setPass(true);
  }, [router]);

  if (!pass) return <p>Loading...</p>;

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
                {taskDetails.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.priority}</TableCell>
                    <TableCell>{row.pending}</TableCell>
                    <TableCell>{row.lapsed}</TableCell>
                    <TableCell>{row.toFinish}</TableCell>
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
