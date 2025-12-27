import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { taskService } from '../services/taskService';
import { aiAgentService } from '../services/aiAgentService';
import { Task } from '../types';
import { Colors } from '../constants/colors';
import { format } from 'date-fns';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeworkDetail'>;

export function HomeworkDetailScreen({ route, navigation }: Props) {
  const { homeworkId } = route.params;
  const [homework, setHomework] = useState<Task | null>(null);
  const [breakdown, setBreakdown] = useState<string[]>([]);

  useEffect(() => {
    loadHomework();
    loadBreakdown();
  }, [homeworkId]);

  const loadHomework = async () => {
    const tasks = await taskService.getAllTasks();
    const task = tasks.find(t => t.id === homeworkId);
    setHomework(task || null);
  };

  const loadBreakdown = async () => {
    const breakdown = await aiAgentService.getTaskBreakdown(homeworkId);
    setBreakdown(breakdown.steps);
  };

  const handleComplete = async () => {
    if (!homework) return;

    Alert.alert('Confirm', 'Mark this task as completed?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          await taskService.completeTask(homeworkId);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleDelete = async () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this task? This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await taskService.deleteTask(homeworkId);
          navigation.goBack();
        },
      },
    ]);
  };

  if (!homework) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Task not found</Text>
      </View>
    );
  }

  const daysUntilDue = Math.ceil((homework.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysUntilDue < 0;
  const isUrgent = daysUntilDue <= 1 && !isOverdue;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return Colors.todo;
      case 'medium':
        return Colors.inProgress;
      case 'low':
        return Colors.done;
      default:
        return Colors.textLight;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    if (homework.status === 'completed') return Colors.done;
    if (homework.status === 'in-progress') return Colors.inProgress;
    return Colors.todo;
  };

  const getStatusText = () => {
    switch (homework.status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Pending';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* 标题卡片 */}
        <View style={[styles.titleCard, { backgroundColor: Colors.cardOrange }]}>
          <View style={styles.titleHeader}>
            <Text style={styles.title}>{homework.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>
          </View>
          <View style={styles.subjectTag}>
            <Text style={styles.subjectText}>{homework.subject}</Text>
          </View>
        </View>

        {/* 信息卡片 */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📅 Due Date</Text>
            <Text style={[styles.infoValue, isOverdue && styles.overdue, isUrgent && styles.urgent]}>
              {format(homework.dueDate, 'MMM dd, yyyy HH:mm')}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>⏱️ Priority</Text>
            <View style={[styles.priorityTag, { backgroundColor: getPriorityColor(homework.priority) }]}>
              <Text style={styles.priorityTagText}>{getPriorityText(homework.priority)}</Text>
            </View>
          </View>

          {homework.estimatedTime && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>⏰ Estimated Time</Text>
                <Text style={styles.infoValue}>{homework.estimatedTime} min</Text>
              </View>
            </>
          )}

          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📊 Time Remaining</Text>
            <Text style={[styles.infoValue, isOverdue && styles.overdue, isUrgent && styles.urgent]}>
              {isOverdue 
                ? `Overdue ${Math.abs(daysUntilDue)} day(s)` 
                : `${daysUntilDue} day(s)`}
            </Text>
          </View>
        </View>

        {/* 描述卡片 */}
        {homework.description && (
          <View style={styles.descriptionCard}>
            <Text style={styles.sectionTitle}>📝 Description</Text>
            <Text style={styles.description}>{homework.description}</Text>
          </View>
        )}

        {/* 建议步骤卡片 */}
        {breakdown.length > 0 && (
          <View style={styles.breakdownCard}>
            <Text style={styles.sectionTitle}>💡 Suggested Steps</Text>
            {breakdown.map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 操作按钮 */}
        <View style={styles.actionButtons}>
          {homework.status !== 'completed' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.completeButton]} 
              onPress={handleComplete}
            >
              <Text style={styles.completeButtonText}>✓ Mark as Completed</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]} 
            onPress={handleDelete}
          >
            <Text style={styles.deleteButtonText}>🗑️ Delete Task</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingTop: 20,
  },
  // 标题卡片
  titleCard: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
  },
  titleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  subjectTag: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  subjectText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  // 信息卡片
  infoCard: {
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  priorityTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  priorityTagText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  overdue: {
    color: Colors.todo,
  },
  urgent: {
    color: Colors.inProgress,
  },
  // 描述卡片
  descriptionCard: {
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  // 步骤卡片
  breakdownCard: {
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  // 操作按钮
  actionButtons: {
    marginBottom: 32,
  },
  actionButton: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  completeButton: {
    backgroundColor: Colors.done,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: Colors.todo,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 40,
  },
});
