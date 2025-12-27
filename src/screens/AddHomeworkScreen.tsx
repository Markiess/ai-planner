import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { homeworkService } from '../services/homeworkService';
import { Colors } from '../constants/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'AddHomework'>;

// 常用科目列表（参考图的类别按钮风格）
const COMMON_SUBJECTS = ['数学', '语文', '英语', '物理', '化学', '生物', '历史', '地理'];

export function AddHomeworkScreen({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [estimatedTime, setEstimatedTime] = useState('');

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('错误', '请输入作业标题');
      return;
    }

    if (!dueDate.trim()) {
      Alert.alert('错误', '请输入截止日期');
      return;
    }

    try {
      const dueDateObj = new Date(dueDate);
      if (isNaN(dueDateObj.getTime())) {
        Alert.alert('错误', '请输入有效的日期格式 (YYYY-MM-DD HH:mm)');
        return;
      }

      await homeworkService.addHomework({
        title: title.trim(),
        description: description.trim() || undefined,
        subject: subject.trim() || '未分类',
        dueDate: dueDateObj,
        priority,
        estimatedTime: estimatedTime ? parseInt(estimatedTime) : undefined,
        status: 'pending',
      });

      Alert.alert('成功', '作业已添加', [
        { text: '确定', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('错误', '添加作业失败，请重试');
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 标题区域（参考图风格 - 浅橙色背景） */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>创建新作业</Text>
      </View>

      <View style={styles.form}>
        {/* 标题输入 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>标题 *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="例如：数学作业第5章"
            placeholderTextColor={Colors.textLight}
          />
        </View>

        {/* 截止日期 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>截止日期 *</Text>
          <TextInput
            style={styles.input}
            value={dueDate}
            onChangeText={setDueDate}
            placeholder="格式：2024-12-31 23:59"
            placeholderTextColor={Colors.textLight}
          />
          <Text style={styles.hint}>请输入日期时间，格式：YYYY-MM-DD HH:mm</Text>
        </View>

        {/* 优先级 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>优先级</Text>
          <View style={styles.priorityContainer}>
            <TouchableOpacity
              style={[
                styles.priorityButton,
                priority === 'high' && { backgroundColor: Colors.todo, borderColor: Colors.todo }
              ]}
              onPress={() => setPriority('high')}
            >
              <Text style={[
                styles.priorityText,
                priority === 'high' && styles.priorityTextActive
              ]}>高</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.priorityButton,
                priority === 'medium' && { backgroundColor: Colors.inProgress, borderColor: Colors.inProgress }
              ]}
              onPress={() => setPriority('medium')}
            >
              <Text style={[
                styles.priorityText,
                priority === 'medium' && styles.priorityTextActive
              ]}>中</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.priorityButton,
                priority === 'low' && { backgroundColor: Colors.done, borderColor: Colors.done }
              ]}
              onPress={() => setPriority('low')}
            >
              <Text style={[
                styles.priorityText,
                priority === 'low' && styles.priorityTextActive
              ]}>低</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 预计时间 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>预计完成时间（分钟）</Text>
          <TextInput
            style={styles.input}
            value={estimatedTime}
            onChangeText={setEstimatedTime}
            placeholder="例如：120"
            keyboardType="numeric"
            placeholderTextColor={Colors.textLight}
          />
        </View>

        {/* 科目/类别选择（参考图的类别按钮风格） */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>科目</Text>
          <View style={styles.categoryContainer}>
            {COMMON_SUBJECTS.map((subj) => (
              <TouchableOpacity
                key={subj}
                style={[
                  styles.categoryButton,
                  subject === subj && styles.categoryButtonActive
                ]}
                onPress={() => setSubject(subj)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  subject === subj && styles.categoryButtonTextActive
                ]}>
                  {subj}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {subject && subject !== '' && !COMMON_SUBJECTS.includes(subject) && (
            <TextInput
              style={[styles.input, styles.customSubjectInput]}
              value={subject}
              onChangeText={setSubject}
              placeholder="自定义科目"
              placeholderTextColor={Colors.textLight}
            />
          )}
          {subject === '' && (
            <TextInput
              style={[styles.input, styles.customSubjectInput]}
              value={subject}
              onChangeText={setSubject}
              placeholder="或输入自定义科目"
              placeholderTextColor={Colors.textLight}
            />
          )}
        </View>

        {/* 描述 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>描述</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="作业的详细描述和注意事项..."
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            placeholderTextColor={Colors.textLight}
          />
        </View>

        {/* 保存按钮 */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>创建作业</Text>
        </TouchableOpacity>
      </View>
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
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  customSubjectInput: {
    marginTop: 8,
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
