import { Task } from '../types';
import { storage } from '../utils/storage';

class TaskService {
  // Get all tasks
  async getAllTasks(): Promise<Task[]> {
    const tasks = await storage.getHomeworks();
    // Convert date strings to Date objects
    return tasks.map(t => ({
      ...t,
      dueDate: new Date(t.dueDate),
      startTime: t.startTime ? new Date(t.startTime) : undefined,
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt),
    })) as Task[];
  }

  // Get pending tasks
  async getPendingTasks(): Promise<Task[]> {
    const all = await this.getAllTasks();
    return all.filter(t => t.status !== 'completed');
  }

  // Get tasks by category
  async getTasksByCategory(category: string): Promise<Task[]> {
    const all = await this.getAllTasks();
    return all.filter(t => t.category === category);
  }

  // Get tasks for a specific date
  async getTasksForDate(date: Date): Promise<Task[]> {
    const all = await this.getAllTasks();
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    return all.filter(t => {
      const taskDate = new Date(t.dueDate);
      return taskDate >= targetDate && taskDate < nextDay;
    });
  }

  // Add task
  async addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const newTask: Task = {
      ...task,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await storage.saveHomework(newTask as any);
    return newTask;
  }

  // Update task
  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const tasks = await this.getAllTasks();
    const task = tasks.find(t => t.id === id);
    
    if (!task) {
      throw new Error('Task not found');
    }

    const updated = {
      ...task,
      ...updates,
      updatedAt: new Date(),
    };
    
    await storage.saveHomework(updated as any);
    return updated;
  }

  // Delete task
  async deleteTask(id: string): Promise<void> {
    await storage.deleteHomework(id);
  }

  // Mark task as completed
  async completeTask(id: string): Promise<Task> {
    return this.updateTask(id, { status: 'completed' });
  }

  // Start task
  async startTask(id: string): Promise<Task> {
    return this.updateTask(id, { status: 'in-progress' });
  }
}

export const taskService = new TaskService();

