import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { TaskCategory, Task } from '../types';
import { Colors } from '../constants/colors';

interface DynamicTaskFormProps {
  category: TaskCategory;
  task: Partial<Task>;
  onChange: (updates: Partial<Task>) => void;
}

export function DynamicTaskForm({ category, task, onChange }: DynamicTaskFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  const renderCategoryFields = () => {
    switch (category) {
      case 'homework':
        return (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Subject *</Text>
              <TextInput
                style={styles.input}
                value={task.subject || ''}
                onChangeText={(value) => updateField('subject', value)}
                placeholder="e.g., Math"
                placeholderTextColor={Colors.textLight}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Difficulty (1-5)</Text>
              <View style={styles.difficultyContainer}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.difficultyButton,
                      task.difficulty === level && styles.difficultyButtonActive,
                    ]}
                    onPress={() => updateField('difficulty', level)}
                  >
                    <Text
                      style={[
                        styles.difficultyText,
                        task.difficulty === level && styles.difficultyTextActive,
                      ]}
                    >
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        );

      case 'work':
        return (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Project Name</Text>
              <TextInput
                style={styles.input}
                value={task.projectName || ''}
                onChangeText={(value) => updateField('projectName', value)}
                placeholder="e.g., Q4 Planning"
                placeholderTextColor={Colors.textLight}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Meeting Link / Location</Text>
              <TextInput
                style={styles.input}
                value={task.meetingLink || task.location || ''}
                onChangeText={(value) => {
                  updateField('meetingLink', value);
                  updateField('location', value);
                }}
                placeholder="Zoom link or address"
                placeholderTextColor={Colors.textLight}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Urgency</Text>
              <View style={styles.priorityContainer}>
                {(['critical', 'high', 'normal'] as const).map((urgency) => (
                  <TouchableOpacity
                    key={urgency}
                    style={[
                      styles.priorityButton,
                      task.urgency === urgency && styles.priorityButtonActive,
                    ]}
                    onPress={() => updateField('urgency', urgency)}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        task.urgency === urgency && styles.priorityTextActive,
                      ]}
                    >
                      {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        );

      case 'sports':
        return (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Sport Type</Text>
              <TextInput
                style={styles.input}
                value={task.sportType || ''}
                onChangeText={(value) => updateField('sportType', value)}
                placeholder="e.g., Running, Gym"
                placeholderTextColor={Colors.textLight}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Intensity (1-5)</Text>
              <View style={styles.difficultyContainer}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.difficultyButton,
                      task.intensity === level && styles.difficultyButtonActive,
                    ]}
                    onPress={() => updateField('intensity', level)}
                  >
                    <Text
                      style={[
                        styles.difficultyText,
                        task.intensity === level && styles.difficultyTextActive,
                      ]}
                    >
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Target Heart Rate</Text>
              <TextInput
                style={styles.input}
                value={task.targetHeartRate?.toString() || ''}
                onChangeText={(value) => updateField('targetHeartRate', parseInt(value) || undefined)}
                keyboardType="numeric"
                placeholder="e.g., 150"
                placeholderTextColor={Colors.textLight}
              />
            </View>
          </>
        );

      case 'shopping':
        return (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Target Store</Text>
              <TextInput
                style={styles.input}
                value={task.targetStore || ''}
                onChangeText={(value) => updateField('targetStore', value)}
                placeholder="e.g., Walmart, Target"
                placeholderTextColor={Colors.textLight}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Budget Limit ($)</Text>
              <TextInput
                style={styles.input}
                value={task.budgetLimit?.toString() || ''}
                onChangeText={(value) => updateField('budgetLimit', parseFloat(value) || undefined)}
                keyboardType="numeric"
                placeholder="e.g., 100"
                placeholderTextColor={Colors.textLight}
              />
            </View>
            <View style={styles.formGroup}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  task.isRecurring && styles.checkboxActive,
                ]}
                onPress={() => updateField('isRecurring', !task.isRecurring)}
              >
                <Text style={styles.checkboxText}>
                  {task.isRecurring ? '✓' : ''} Recurring Purchase
                </Text>
              </TouchableOpacity>
            </View>
          </>
        );

      case 'transport':
        return (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Departure</Text>
              <TextInput
                style={styles.input}
                value={task.departureLocation || ''}
                onChangeText={(value) => updateField('departureLocation', value)}
                placeholder="From"
                placeholderTextColor={Colors.textLight}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Arrival</Text>
              <TextInput
                style={styles.input}
                value={task.arrivalLocation || ''}
                onChangeText={(value) => updateField('arrivalLocation', value)}
                placeholder="To"
                placeholderTextColor={Colors.textLight}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Transport Type</Text>
              <TextInput
                style={styles.input}
                value={task.transportType || ''}
                onChangeText={(value) => updateField('transportType', value)}
                placeholder="e.g., Car, Bus, Flight"
                placeholderTextColor={Colors.textLight}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Buffer Time (minutes)</Text>
              <TextInput
                style={styles.input}
                value={task.bufferTime?.toString() || ''}
                onChangeText={(value) => updateField('bufferTime', parseInt(value) || undefined)}
                keyboardType="numeric"
                placeholder="e.g., 15"
                placeholderTextColor={Colors.textLight}
              />
            </View>
          </>
        );

      case 'daily':
        return (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Habit Name</Text>
              <TextInput
                style={styles.input}
                value={task.habitName || ''}
                onChangeText={(value) => updateField('habitName', value)}
                placeholder="e.g., Morning Meditation"
                placeholderTextColor={Colors.textLight}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Reminder Frequency</Text>
              <TextInput
                style={styles.input}
                value={task.reminderFrequency || ''}
                onChangeText={(value) => updateField('reminderFrequency', value)}
                placeholder="e.g., Daily, Weekly"
                placeholderTextColor={Colors.textLight}
              />
            </View>
            <View style={styles.formGroup}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  task.moodTracking && styles.checkboxActive,
                ]}
                onPress={() => updateField('moodTracking', !task.moodTracking)}
              >
                <Text style={styles.checkboxText}>
                  {task.moodTracking ? '✓' : ''} Track Mood
                </Text>
              </TouchableOpacity>
            </View>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderCategoryFields()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
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
  difficultyContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  difficultyButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    alignItems: 'center',
  },
  difficultyButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  difficultyText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  },
  difficultyTextActive: {
    color: '#FFFFFF',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    alignItems: 'center',
  },
  priorityButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  priorityText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  priorityTextActive: {
    color: '#FFFFFF',
  },
  checkbox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  checkboxActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  checkboxText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
});

