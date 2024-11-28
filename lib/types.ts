import { TaskStatus} from '@prisma/client';
export interface Task {
    id: string
    title: string
    priority: number
    status: "PENDING" | "FINISHED"
    startTime: string
    endTime: string
    totalTime: number
}

export interface TaskFormData {
    title: string
    priority: number
    status: "PENDING" | "FINISHED"
    startTime: string
    endTime: string
}

export interface TaskDetail {
    id: string;
    priority: 'High' | 'Medium' | 'Low';
    pending: number;
    lapsed: number;
    toFinish: number;
  }
  

export interface CreateTaskInput {
  title: string;
  priority?: number;
  status?: TaskStatus;
}

export interface UpdateTaskInput {
  id: number;
  title?: string;
  priority?: number;
  status?: TaskStatus;
}

export interface TaskSummary {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  avgCompletionTime: string;
}
