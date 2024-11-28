import * as z from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  startTime: z.string().datetime("Invalid start time"),
  endTime: z.string().datetime("Invalid end time"),
  priority: z.number().min(1).max(5, "Priority must be between 1 and 5"),
  status: z.enum(["PENDING", "FINISHED"]),
});

export type TaskInput = z.infer<typeof taskSchema>;