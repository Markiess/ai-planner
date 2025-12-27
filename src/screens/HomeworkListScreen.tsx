import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TabParamList, RootStackParamList } from '../navigation/AppNavigator';
import { taskService } from '../services/taskService';
import { Task } from '../types';
import { Colors } from '../constants/colors';
import { format } from 'date-fns';

type Props = NativeStackScreenProps<TabParamList, 'HomeworkList'>;

export function HomeworkListScreen({ navigation }: Props) {
  const [homeworks, setHomeworks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHomeworks();
    
    const unsubscribe = navigation.addListener('focus', () => {
      loadHomeworks();
    });

    return unsubscribe;
  }, [navigation]);

  const loadHomeworks = async () => {
    const data = await taskService.getAllTasks();
    // Sort by due date
    data.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
    setHomeworks(data);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeworks();
    setRefreshing(false);
  };

  // 根据索引获取卡片颜色（循环使用参考图中的柔和颜色）
  const getCardColor = (index: number, status: string) => {
    if (status === 'completed') {
      return Colors.doneLight;
    }
    if (status === 'in-progress') {
      return Colors.inProgressLight;
    }
    const colors = [Colors.cardOrange, Colors.cardPink, Colors.cardBlue, Colors.cardGreen];
    return colors[index % colors.length];
  };

  // 获取优先级颜色
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
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return '';
    }
  };

  const renderHomeworkItem = ({ item, index }: { item: Task; index: number }) => {
    const daysUntilDue = Math.ceil((item.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysUntilDue < 0;
    const isUrgent = daysUntilDue <= 1 && !isOverdue;
    const cardColor = getCardColor(index, item.status);

    return (
      <TouchableOpacity
        style={[styles.homeworkCard, { backgroundColor: cardColor }]}
        onPress={() => {
          (navigation as any).getParent()?.navigate('HomeworkDetail', { homeworkId: item.id });
        }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
            <Text style={styles.homeworkTitle}>{item.title}</Text>
          </View>
          {item.status === 'completed' && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓ Completed</Text>
            </View>
          )}
        </View>
        
        {item.description && (
          <Text style={styles.homeworkDescription} numberOfLines={3}>
            {item.description}
          </Text>
        )}
        
        <View style={styles.cardFooter}>
          <View style={styles.subjectTag}>
            <Text style={styles.subjectText}>{item.subject || item.category}</Text>
          </View>
          <View style={styles.dateInfo}>
            <Text style={[
              styles.dueDateText,
              isOverdue && styles.overdue,
              isUrgent && styles.urgent
            ]}>
              {isOverdue 
                ? `Overdue ${Math.abs(daysUntilDue)} day(s)` 
                : isUrgent 
                  ? `Due in ${daysUntilDue} day(s)` 
                  : `${daysUntilDue} day(s) left`}
            </Text>
          </View>
        </View>

        <View style={styles.cardMeta}>
          <Text style={styles.metaText}>
            {format(item.dueDate, 'MMM dd, HH:mm')}
          </Text>
          {item.estimatedTime && (
            <Text style={styles.metaText}>
              • Est. {item.estimatedTime} min
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={homeworks}
        renderItem={renderHomeworkItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>No tasks yet</Text>
            <Text style={styles.emptySubtext}>Tap the "+" button to add a task</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: 16,
    paddingTop: 20,
  },
  homeworkCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  homeworkTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  completedBadge: {
    backgroundColor: Colors.done,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  homeworkDescription: {
    fontSize: 15,
    color: Colors.textLight,
    lineHeight: 22,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectTag: {
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  subjectText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  dateInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  dueDateText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  overdue: {
    color: Colors.todo,
    fontWeight: '600',
  },
  urgent: {
    color: Colors.inProgress,
    fontWeight: '600',
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  metaText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textLight,
  },
});
