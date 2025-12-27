import { Homework } from '../types';
import { storage } from '../utils/storage';

class HomeworkService {
  // 获取所有作业
  async getAllHomeworks(): Promise<Homework[]> {
    const homeworks = await storage.getHomeworks();
    // 转换日期字符串为Date对象
    return homeworks.map(h => ({
      ...h,
      dueDate: new Date(h.dueDate),
      createdAt: new Date(h.createdAt),
      updatedAt: new Date(h.updatedAt),
    }));
  }

  // 获取待完成的作业
  async getPendingHomeworks(): Promise<Homework[]> {
    const all = await this.getAllHomeworks();
    return all.filter(h => h.status !== 'completed');
  }

  // 添加作业
  async addHomework(homework: Omit<Homework, 'id' | 'createdAt' | 'updatedAt'>): Promise<Homework> {
    const newHomework: Homework = {
      ...homework,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await storage.saveHomework(newHomework);
    return newHomework;
  }

  // 更新作业
  async updateHomework(id: string, updates: Partial<Homework>): Promise<Homework> {
    const homeworks = await this.getAllHomeworks();
    const homework = homeworks.find(h => h.id === id);
    
    if (!homework) {
      throw new Error('作业不存在');
    }

    const updated = {
      ...homework,
      ...updates,
      updatedAt: new Date(),
    };
    
    await storage.saveHomework(updated);
    return updated;
  }

  // 删除作业
  async deleteHomework(id: string): Promise<void> {
    await storage.deleteHomework(id);
  }

  // 标记作业为完成
  async completeHomework(id: string): Promise<Homework> {
    return this.updateHomework(id, { status: 'completed' });
  }
}

export const homeworkService = new HomeworkService();

