import { Task, AIRecommendation, AITaskBreakdown, TimeConflict } from '../types';
import { taskService } from './taskService';

/**
 * AI Agent Service
 * Provides intelligent recommendations, task breakdown, and scheduling
 */
class AIAgentService {
  /**
   * Get recommendations with daily brief
   */
  async getRecommendations(date?: Date): Promise<AIRecommendation> {
    const targetDate = date || new Date();
    const tasks = await taskService.getTasksForDate(targetDate);
    const pendingTasks = tasks.filter(t => t.status !== 'completed');
    
    if (pendingTasks.length === 0) {
      return {
        suggestedOrder: [],
        reasoning: 'No pending tasks for today. Keep up the great work!',
        dailyBrief: 'You have a free day! Perfect time to relax or catch up on personal projects.',
      };
    }

    // Sort by priority and due date
    const sorted = [...pendingTasks].sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      return a.dueDate.getTime() - b.dueDate.getTime();
    });

    const suggestedOrder = sorted.map(t => t.id);
    const focusTask = sorted[0]?.id;
    
    const reasoning = this.generateReasoning(sorted);
    const tips = this.generateTips(sorted);
    const dailyBrief = this.generateDailyBrief(sorted);
    const conflicts = this.detectConflicts(pendingTasks);

    return {
      suggestedOrder,
      reasoning,
      focusTask,
      tips,
      dailyBrief,
      conflicts,
    };
  }

  /**
   * Generate daily brief
   */
  private generateDailyBrief(tasks: Task[]): string {
    const totalTime = tasks.reduce((sum, t) => sum + (t.estimatedTime || 0), 0);
    const hours = Math.round(totalTime / 60);
    const highPriorityCount = tasks.filter(t => t.priority === 'high').length;
    
    if (tasks.length === 0) {
      return 'You have a free day!';
    }
    
    if (highPriorityCount > 0) {
      return `Busy day ahead: ${tasks.length} tasks (${highPriorityCount} high priority), ~${hours}h estimated.`;
    }
    
    return `Moderate day: ${tasks.length} tasks, ~${hours}h estimated. Manageable schedule!`;
  }

  /**
   * Detect time conflicts
   */
  private detectConflicts(tasks: Task[]): TimeConflict[] {
    const conflicts: TimeConflict[] = [];
    
    for (let i = 0; i < tasks.length; i++) {
      for (let j = i + 1; j < tasks.length; j++) {
        const task1 = tasks[i];
        const task2 = tasks[j];
        
        if (!task1.startTime || !task2.startTime || !task1.estimatedTime || !task2.estimatedTime) {
          continue;
        }
        
        const end1 = new Date(task1.startTime.getTime() + task1.estimatedTime * 60000);
        const end2 = new Date(task2.startTime.getTime() + task2.estimatedTime * 60000);
        
        // Check for overlap
        if (task1.startTime < end2 && task2.startTime < end1) {
          const overlapStart = task1.startTime > task2.startTime ? task1.startTime : task2.startTime;
          const overlapEnd = end1 < end2 ? end1 : end2;
          
          conflicts.push({
            taskId1: task1.id,
            taskId2: task2.id,
            overlapStart,
            overlapEnd,
          });
        }
      }
    }
    
    return conflicts;
  }

  /**
   * Generate reasoning
   */
  private generateReasoning(tasks: Task[]): string {
    if (tasks.length === 0) return '';
    
    const topTask = tasks[0];
    const highPriorityCount = tasks.filter(t => t.priority === 'high').length;
    const urgentCount = tasks.filter(t => {
      const hoursUntilDue = (t.dueDate.getTime() - Date.now()) / (1000 * 60 * 60);
      return hoursUntilDue <= 24;
    }).length;

    let reasoning = `Prioritize "${topTask.title}"`;
    
    if (topTask.priority === 'high') {
      reasoning += ', a high-priority task';
    }
    
    const hoursUntilDue = (topTask.dueDate.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntilDue <= 24) {
      reasoning += ' with deadline approaching';
    }
    
    if (highPriorityCount > 1) {
      reasoning += `. ${highPriorityCount - 1} more high-priority tasks need attention`;
    }
    
    if (urgentCount > 1) {
      reasoning += `. ${urgentCount} tasks due within 24 hours`;
    }

    return reasoning + '.';
  }

  /**
   * Generate tips
   */
  private generateTips(tasks: Task[]): string[] {
    const tips: string[] = [];
    
    const urgentTasks = tasks.filter(t => {
      const hoursUntilDue = (t.dueDate.getTime() - Date.now()) / (1000 * 60 * 60);
      return hoursUntilDue <= 24;
    });

    if (urgentTasks.length > 0) {
      tips.push(`${urgentTasks.length} task(s) due within 24 hours - prioritize these`);
    }

    const totalEstimatedTime = tasks.reduce((sum, t) => sum + (t.estimatedTime || 0), 0);
    if (totalEstimatedTime > 0) {
      const hours = Math.ceil(totalEstimatedTime / 60);
      tips.push(`Total estimated time: ~${hours} hours`);
    }

    const highPriorityTasks = tasks.filter(t => t.priority === 'high');
    if (highPriorityTasks.length > 0) {
      tips.push(`Complete ${highPriorityTasks.length} high-priority task(s) to reduce stress`);
    }

    return tips;
  }

  /**
   * Get task breakdown with icebreaker
   */
  async getTaskBreakdown(taskId: string): Promise<AITaskBreakdown> {
    const tasks = await taskService.getAllTasks();
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
      return { steps: [] };
    }

    const steps: string[] = [];
    let icebreaker: string | undefined;
    
    // Category-specific breakdown
    switch (task.category) {
      case 'homework':
        steps.push(`Review requirements for "${task.title}"`);
        if (task.subject) {
          steps.push(`Gather materials and references for ${task.subject}`);
        }
        steps.push('Create a plan and allocate time');
        if (task.estimatedTime && task.estimatedTime > 60) {
          steps.push('Break into time blocks with 5-10 min breaks');
        }
        steps.push('Start working on the task');
        steps.push('Review and refine upon completion');
        
        if (task.difficulty && task.difficulty >= 4) {
          icebreaker = `This task looks challenging. Start with the easiest part for 5 minutes to build momentum!`;
        }
        break;
        
      case 'work':
        steps.push(`Prepare for "${task.title}"`);
        if (task.checklist && task.checklist.length > 0) {
          steps.push(`Review checklist: ${task.checklist.join(', ')}`);
        }
        if (task.meetingLink) {
          steps.push('Test meeting link and prepare agenda');
        }
        steps.push('Gather necessary documents');
        steps.push('Execute the task');
        steps.push('Follow up and document outcomes');
        break;
        
      case 'sports':
        steps.push(`Prepare for ${task.sportType || 'workout'}`);
        if (task.equipmentNeeded && task.equipmentNeeded.length > 0) {
          steps.push(`Gather equipment: ${task.equipmentNeeded.join(', ')}`);
        }
        steps.push('Warm up (5-10 minutes)');
        steps.push('Main activity');
        steps.push('Cool down and stretch');
        break;
        
      case 'shopping':
        steps.push(`Review shopping list for "${task.title}"`);
        if (task.budgetLimit) {
          steps.push(`Set budget limit: $${task.budgetLimit}`);
        }
        if (task.targetStore) {
          steps.push(`Plan route to ${task.targetStore}`);
        }
        steps.push('Go shopping');
        steps.push('Review purchases and receipts');
        break;
        
      case 'transport':
        steps.push(`Plan trip: ${task.departureLocation} → ${task.arrivalLocation}`);
        if (task.bufferTime) {
          steps.push(`Add ${task.bufferTime} min buffer for delays`);
        }
        if (task.ticketInfo) {
          steps.push(`Prepare ticket: ${task.ticketInfo}`);
        }
        steps.push('Depart on time');
        steps.push('Arrive and confirm');
        break;
        
      case 'daily':
        steps.push(`Set up reminder for "${task.habitName || task.title}"`);
        if (task.reminderFrequency) {
          steps.push(`Configure frequency: ${task.reminderFrequency}`);
        }
        steps.push('Execute the habit');
        if (task.moodTracking) {
          steps.push('Record mood/feeling');
        }
        break;
        
      default:
        steps.push(`Prepare for "${task.title}"`);
        steps.push('Execute the task');
        steps.push('Review and complete');
    }

    return {
      steps,
      icebreaker,
      estimatedStepsTime: steps.map(() => Math.floor((task.estimatedTime || 30) / steps.length)),
    };
  }

  /**
   * Smart reschedule - automatically adjust task times to avoid conflicts
   */
  async smartReschedule(date: Date): Promise<Task[]> {
    const tasks = await taskService.getTasksForDate(date);
    const pendingTasks = tasks.filter(t => t.status !== 'completed' && t.startTime);
    
    // Sort by priority and due date
    const sorted = [...pendingTasks].sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.dueDate.getTime() - b.dueDate.getTime();
    });
    
    const rescheduled: Task[] = [];
    let currentTime = new Date(date);
    currentTime.setHours(9, 0, 0, 0); // Start at 9 AM
    
    for (const task of sorted) {
      if (!task.estimatedTime) continue;
      
      const newStartTime = new Date(currentTime);
      const newEndTime = new Date(currentTime.getTime() + task.estimatedTime * 60000);
      
      // Check if it fits before due date
      if (newEndTime <= task.dueDate) {
        const updated = await taskService.updateTask(task.id, { startTime: newStartTime });
        rescheduled.push(updated);
        currentTime = newEndTime;
        
        // Add 15 min buffer between tasks
        currentTime.setMinutes(currentTime.getMinutes() + 15);
      }
    }
    
    return rescheduled;
  }
}

export const aiAgentService = new AIAgentService();
