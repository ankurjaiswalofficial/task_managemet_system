export interface Task {
    id: string
    title: string
    priority: number
    status: "Pending" | "Finished"
    startTime: string
    endTime: string
    totalTime: number
}

export interface TaskFormData {
    title: string
    priority: number
    status: "Pending" | "Finished"
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
  

export interface Summary {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    avgCompletionTime: string;
  }
  