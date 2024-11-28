"use client";

import { Layout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { TaskDialog } from "@/components/task-dialog";

type Task = {
  id: string;
  title: string;
  priority: number;
  status: "Pending" | "Finished";
  startTime: string;
  endTime: string;
  totalTime: number;
  selected?: boolean;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/tasks", {headers: { Authorization: `Bearer ${token}` }, method: "GET", body: JSON.stringify({ email, token })});
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      const tasksWithSelection = data.map((task: Task) => ({ ...task, selected: false }));
      setTasks(tasksWithSelection);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTaskSelection = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, selected: !task.selected } : task
      )
    );
  };

  const handleDeleteSelected = async () => {
    const selectedIds = tasks.filter((task) => task.selected).map((task) => task.id);
    if (selectedIds.length === 0) return; 
    try {
      const res = await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, email, token }),
      });
      if (!res.ok) throw new Error("Failed to delete tasks");
      setTasks((prevTasks) => prevTasks.filter((task) => !selectedIds.includes(task.id)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSort = (key: "startTime" | "endTime") => {
    const sortedTasks = [...tasks].sort((a, b) => {
      const dateA = new Date(a[key]).getTime();
      const dateB = new Date(b[key]).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setTasks(sortedTasks);
  };

  return (
    <Layout>
      <div className="container py-10 space-y-8 mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Task List</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedTask(null);
                setIsDialogOpen(true);
              }}
            >
              + Add Task
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Priority</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[1, 2, 3, 4, 5].map((priority) => (
                  <DropdownMenuItem
                    key={priority}
                    onClick={() =>
                      setTasks(tasks.filter((task) => task.priority === priority))
                    }
                  >
                    Priority {priority}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem onClick={() => fetchTasks()}>Remove Filter</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Status</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() =>
                    setTasks(tasks.filter((task) => task.status === "Pending"))
                  }
                >
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setTasks(tasks.filter((task) => task.status === "Finished"))
                  }
                >
                  Finished
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => fetchTasks()}>Remove Filter</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    onCheckedChange={(checked) =>
                      setTasks((prevTasks) =>
                        prevTasks.map((task) => ({ ...task, selected: !!checked }))
                      )
                    }
                  />
                </TableHead>
                <TableHead>Task ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <Button variant="link" onClick={() => handleSort("startTime")}>
                    Start Time
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="link" onClick={() => handleSort("endTime")}>
                    End Time
                  </Button>
                </TableHead>
                <TableHead>Total Time (hrs)</TableHead>
                <TableHead className="w-12">Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Checkbox
                      checked={task.selected}
                      onCheckedChange={() => toggleTaskSelection(task.id)}
                    />
                  </TableCell>
                  <TableCell>{task.id}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{task.startTime}</TableCell>
                  <TableCell>{task.endTime}</TableCell>
                  <TableCell>{task.totalTime}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedTask(task);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {tasks.some((task) => task.selected) && (
          <Button variant="destructive" onClick={handleDeleteSelected}>
            Delete Selected
          </Button>
        )}
      </div>

      <TaskDialog
        task={selectedTask}
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) fetchTasks();
        }}
      />
    </Layout>
  );
}
