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
import { toast } from "@/hooks/use-toast";

type Task = {
  id: string;
  title: string;
  priority: number;
  status: "PENDING" | "FINISHED";
  startTime: string;
  endTime: string;
  totalTime: number;
  selected?: boolean;
};

export default function TasksPage() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch tasks");
      }
      
      const data = await res.json();
      const tasksWithSelection = data.map((task: Task) => ({ ...task, selected: false }));
      setAllTasks(tasksWithSelection);
      setTasks(tasksWithSelection);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Unable to fetch tasks",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const toggleTaskSelection = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, selected: !task.selected } : task
      )
    );
  };

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: taskData.title,
          priority: taskData.priority,
          status: taskData.status,
          startTime: taskData.startTime,
          endTime: taskData.endTime,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create task");
      }

      const newTask = await res.json();
      setTasks((prevTasks) => [...prevTasks, { ...newTask, selected: false }]);
      
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Unable to create task",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async (taskData: Task) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: taskData.id,
          title: taskData.title,
          priority: taskData.priority,
          status: taskData.status,
          startTime: taskData.startTime,
          endTime: taskData.endTime,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask = await res.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => 
          task.id === updatedTask.id ? { ...updatedTask, selected: task.selected } : task
        )
      );
      
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Unable to update task",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSelected = async () => {
    const selectedIds = tasks.filter((task) => task.selected).map((task) => task.id);
    
    if (selectedIds.length === 0) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/tasks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete tasks");
      }

      setTasks((prevTasks) => prevTasks.filter((task) => !selectedIds.includes(task.id)));
      
      toast({
        title: "Success",
        description: `${selectedIds.length} task(s) deleted successfully`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Unable to delete tasks",
        variant: "destructive",
      });
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

  const handleDialogSubmit = (taskData: Partial<Task>) => {
    if (selectedTask) {
      handleUpdateTask({ ...selectedTask, ...taskData });
    } else {
      handleCreateTask(taskData);
    }
    setIsDialogOpen(false);
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
                      setTasks(allTasks.filter((task) => task.priority === priority))
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
                    setTasks(allTasks.filter((task) => task.status === "PENDING"))
                  }
                >
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setTasks(allTasks.filter((task) => task.status === "FINISHED"))
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
        onSubmit={handleDialogSubmit}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setSelectedTask(null);
          }
        }}
      />
    </Layout>
  );
}
