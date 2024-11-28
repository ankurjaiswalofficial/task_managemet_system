"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useState, useEffect } from "react"

interface TaskDialogProps {
  task?: {
    id: string
    title: string
    priority: number
    status: "PENDING" | "FINISHED"
    startTime: string
    endTime: string
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (taskData: any) => void
}

export function TaskDialog({ task, open, onOpenChange, onSubmit }: Readonly<TaskDialogProps>) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState(1);
  const [status, setStatus] = useState<"PENDING" | "FINISHED">("PENDING");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (open && task) {
      setTitle(task.title);
      setPriority(task.priority);
      setStatus(task.status);
      setStartTime(task.startTime ? new Date(task.startTime).toISOString().slice(0, 16) : "");
      setEndTime(task.endTime ? new Date(task.endTime).toISOString().slice(0, 16) : "");
    } else if (!open) {
      setTitle("");
      setPriority(1);
      setStatus("PENDING");
      setStartTime("");
      setEndTime("");
    }
  }, [open, task]);

  const handleSubmit = () => {
    const taskData = {
      id: task?.id,
      title,
      priority,
      status,
      startTime: startTime ? new Date(startTime).toISOString() : new Date().toISOString(),
      endTime: status === "FINISHED" && endTime 
        ? new Date(endTime).toISOString() 
        : status === "FINISHED" 
          ? new Date().toISOString() 
          : ""
    };

    onSubmit(taskData);
    onOpenChange(false);
  };

  const handleStatusToggle = (checked: boolean) => {
    setStatus(checked ? "FINISHED" : "PENDING");
  };

  const isEditing = !!task;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={String(priority)} 
                onValueChange={(value) => setPriority(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((p) => (
                    <SelectItem key={p} value={String(p)}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={status === "FINISHED"}
                  onCheckedChange={handleStatusToggle}
                />
                <Label>{status === "FINISHED" ? "Finished" : "Pending"}</Label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={status === "PENDING"}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing ? "Update Task" : "Add Task"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
