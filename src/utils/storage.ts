import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, Homework } from '../types';

const HOMEWORK_KEY = '@homework_list';
const PREFERENCES_KEY = '@user_preferences';

// 作业存储操作
export const storage = {
  // 保存作业列表
  async saveHomeworks(homeworks: Homework[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(homeworks);
      await AsyncStorage.setItem(HOMEWORK_KEY, jsonValue);
    } catch (e) {
      console.error('保存作业列表失败:', e);
      throw e;
    }
  },

  // 获取作业列表
  async getHomeworks(): Promise<Homework[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(HOMEWORK_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('获取作业列表失败:', e);
      return [];
    }
  },

  // 保存单个作业
  async saveHomework(homework: Homework): Promise<void> {
    const homeworks = await this.getHomeworks();
    const index = homeworks.findIndex(h => h.id === homework.id);
    
    if (index >= 0) {
      homeworks[index] = { ...homework, updatedAt: new Date() };
    } else {
      homeworks.push(homework);
    }
    
    await this.saveHomeworks(homeworks);
  },

  // 删除作业
  async deleteHomework(id: string): Promise<void> {
    const homeworks = await this.getHomeworks();
    const filtered = homeworks.filter(h => h.id !== id);
    await this.saveHomeworks(filtered);
  },
};

