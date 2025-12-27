import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Task, TaskCategory } from '../types';
import { Colors } from '../constants/colors';
import { format } from 'date-fns';

const SCREEN_WIDTH = Dimensions.get('window').width;
const HOUR_WIDTH = 60; // Width for each hour
const START_HOUR = 6; // Start at 6 AM
const END_HOUR = 24; // End at midnight
const TOTAL_HOURS = END_HOUR - START_HOUR;

interface GanttChartProps {
  tasks: Task[];
  selectedDate: Date;
  onTaskPress?: (task: Task) => void;
  conflicts?: Array<{ taskId1: string; taskId2: string }>;
}

export function GanttChart({ tasks, selectedDate, onTaskPress, conflicts = [] }: GanttChartProps) {
  // Get category color
  const getCategoryColor = (category: TaskCategory): string => {
    switch (category) {
      case 'homework':
        return Colors.categoryHomework;
      case 'work':
        return Colors.categoryWork;
      case 'sports':
        return Colors.categorySports;
      case 'shopping':
        return Colors.categoryShopping;
      case 'transport':
        return Colors.categoryTransport;
      case 'daily':
        return Colors.categoryDaily;
      default:
        return Colors.primary;
    }
  };

  // Calculate task position and width
  const getTaskPosition = (task: Task) => {
    if (!task.startTime) return null;
    
    const taskDate = new Date(task.startTime);
    const selectedDateStart = new Date(selectedDate);
    selectedDateStart.setHours(0, 0, 0, 0);
    
    // Check if task is on selected date
    if (taskDate.toDateString() !== selectedDate.toDateString()) {
      return null;
    }
    
    const hours = taskDate.getHours() + taskDate.getMinutes() / 60;
    const left = (hours - START_HOUR) * HOUR_WIDTH;
    const width = (task.estimatedTime || 60) / 60 * HOUR_WIDTH;
    
    return { left, width };
  };

  // Check if task has conflict
  const hasConflict = (taskId: string): boolean => {
    return conflicts.some(c => c.taskId1 === taskId || c.taskId2 === taskId);
  };

  // Render hour labels
  const renderHourLabels = () => {
    const hours = [];
    for (let i = START_HOUR; i < END_HOUR; i++) {
      hours.push(
        <View key={i} style={[styles.hourLabel, { left: (i - START_HOUR) * HOUR_WIDTH }]}>
          <Text style={styles.hourText}>{i}:00</Text>
        </View>
      );
    }
    return hours;
  };

  // Render task bars
  const renderTasks = () => {
    return tasks
      .filter(task => {
        if (!task.startTime) return false;
        const taskDate = new Date(task.startTime);
        return taskDate.toDateString() === selectedDate.toDateString();
      })
      .map((task) => {
        const position = getTaskPosition(task);
        if (!position) return null;
        
        const conflict = hasConflict(task.id);
        
        return (
          <TouchableOpacity
            key={task.id}
            style={[
              styles.taskBar,
              {
                left: position.left,
                width: Math.max(position.width, 40),
                backgroundColor: getCategoryColor(task.category),
                borderColor: conflict ? Colors.error : 'transparent',
                borderWidth: conflict ? 2 : 0,
                borderStyle: conflict ? 'dashed' : 'solid',
              },
            ]}
            onPress={() => onTaskPress?.(task)}
          >
            <Text style={styles.taskTitle} numberOfLines={1}>
              {task.title}
            </Text>
            {task.estimatedTime && (
              <Text style={styles.taskTime}>
                {Math.floor(task.estimatedTime / 60)}h {task.estimatedTime % 60}m
              </Text>
            )}
          </TouchableOpacity>
        );
      });
  };

  return (
    <View style={styles.container}>
      {/* Hour labels */}
      <View style={styles.hourLabelsContainer}>
        {renderHourLabels()}
      </View>
      
      {/* Timeline area */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timelineContainer}>
        <View style={[styles.timeline, { width: TOTAL_HOURS * HOUR_WIDTH }]}>
          {/* Hour grid lines */}
          {Array.from({ length: TOTAL_HOURS + 1 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.gridLine,
                { left: i * HOUR_WIDTH },
              ]}
            />
          ))}
          
          {/* Task bars */}
          {renderTasks()}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
  },
  hourLabelsContainer: {
    height: 30,
    marginBottom: 8,
    position: 'relative',
  },
  hourLabel: {
    position: 'absolute',
    top: 0,
    width: HOUR_WIDTH,
    alignItems: 'center',
  },
  hourText: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500',
  },
  timelineContainer: {
    maxHeight: 400,
  },
  timeline: {
    height: 300,
    position: 'relative',
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  gridLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: Colors.border,
  },
  taskBar: {
    position: 'absolute',
    top: 20,
    minHeight: 60,
    borderRadius: 8,
    padding: 8,
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  taskTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  taskTime: {
    color: '#FFFFFF',
    fontSize: 10,
    opacity: 0.9,
  },
});

