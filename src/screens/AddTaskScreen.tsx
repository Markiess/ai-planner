import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { taskService } from '../services/taskService';
import { Colors } from '../constants/colors';
import { TaskCategory, Task } from '../types';
import { CategorySelector } from '../components/CategorySelector';
import { DynamicTaskForm } from '../components/DynamicTaskForm';

type Props = NativeStackScreenProps<RootStackParamList, 'AddHomework'>;

export function AddTaskScreen({ navigation }: Props) {
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [category, setCategory] = useState<TaskCategory | null>(null);
  const [task, setTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    dueDate: new Date(),
    priority: 'medium',
    status: 'pending',
  });

  const handleSave = async () => {
    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    if (!task.title?.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (!task.dueDate) {
      Alert.alert('Error', 'Please set a due date');
      return;
    }

    try {
      const dueDateObj = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
      
      await taskService.addTask({
        ...task,
        category,
        dueDate: dueDateObj,
        startTime: task.startTime instanceof Date ? task.startTime : task.startTime ? new Date(task.startTime) : undefined,
      } as Task);

      Alert.alert('Success', 'Task added', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add task, please try again');
      console.error(error);
    }
  };

  const updateTask = (updates: Partial<Task>) => {
    setTask(prev => ({ ...prev, ...updates }));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create New Task</Text>
      </View>

      <View style={styles.form}>
        {/* Category Selection */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Category *</Text>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => setShowCategorySelector(true)}
          >
            <Text style={styles.categoryButtonText}>
              {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Select Category'}
            </Text>
            <Text style={styles.categoryButtonArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={task.title}
            onChangeText={(value) => updateTask({ title: value })}
            placeholder="e.g., Math Homework Chapter 5"
            placeholderTextColor={Colors.textLight}
          />
        </View>

        {/* Start Time */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Start Time</Text>
          <TextInput
            style={styles.input}
            value={task.startTime ? new Date(task.startTime).toLocaleString() : ''}
            onChangeText={(value) => {
              const date = new Date(value);
              if (!isNaN(date.getTime())) {
                updateTask({ startTime: date });
              }
            }}
            placeholder="Format: YYYY-MM-DD HH:mm"
            placeholderTextColor={Colors.textLight}
          />
          <Text style={styles.hint}>Leave empty to auto-schedule</Text>
        </View>

        {/* Due Date */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Due Date *</Text>
          <TextInput
            style={styles.input}
            value={task.dueDate ? new Date(task.dueDate).toLocaleString() : ''}
            onChangeText={(value) => {
              const date = new Date(value);
              if (!isNaN(date.getTime())) {
                updateTask({ dueDate: date });
              }
            }}
            placeholder="Format: YYYY-MM-DD HH:mm"
            placeholderTextColor={Colors.textLight}
          />
        </View>

        {/* Priority */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.priorityContainer}>
            {(['high', 'medium', 'low'] as const).map((priority) => (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.priorityButton,
                  task.priority === priority && {
                    backgroundColor: priority === 'high' ? Colors.todo : priority === 'medium' ? Colors.inProgress : Colors.done,
                    borderColor: priority === 'high' ? Colors.todo : priority === 'medium' ? Colors.inProgress : Colors.done,
                  },
                ]}
                onPress={() => updateTask({ priority })}
              >
                <Text
                  style={[
                    styles.priorityText,
                    task.priority === priority && styles.priorityTextActive,
                  ]}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Estimated Time */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Estimated Time (minutes)</Text>
          <TextInput
            style={styles.input}
            value={task.estimatedTime?.toString() || ''}
            onChangeText={(value) => updateTask({ estimatedTime: parseInt(value) || undefined })}
            keyboardType="numeric"
            placeholder="e.g., 120"
            placeholderTextColor={Colors.textLight}
          />
        </View>

        {/* Dynamic Category Fields */}
        {category && (
          <DynamicTaskForm
            category={category}
            task={task}
            onChange={updateTask}
          />
        )}

        {/* Description */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={task.description}
            onChangeText={(value) => updateTask({ description: value })}
            placeholder="Task details and notes..."
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            placeholderTextColor={Colors.textLight}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Create Task</Text>
        </TouchableOpacity>
      </View>

      {/* Category Selector Modal */}
      <CategorySelector
        visible={showCategorySelector}
        onClose={() => setShowCategorySelector(false)}
        onSelect={(cat) => {
          setCategory(cat);
          setShowCategorySelector(false);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.cardOrange,
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  form: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 8,
  },
  categoryButton: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryButtonText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  categoryButtonArrow: {
    fontSize: 20,
    color: Colors.textLight,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  },
  priorityTextActive: {
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 32,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

