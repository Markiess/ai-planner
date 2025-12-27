import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TabParamList } from '../navigation/AppNavigator';
import { aiAgentService } from '../services/aiAgentService';
import { taskService } from '../services/taskService';
import { AIRecommendation, Task } from '../types';
import { Colors } from '../constants/colors';

type Props = NativeStackScreenProps<TabParamList, 'AISuggestions'>;

export function AISuggestionsScreen({ navigation }: Props) {
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [orderedHomeworks, setOrderedHomeworks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRecommendations();
    
    const unsubscribe = navigation.addListener('focus', () => {
      loadRecommendations();
    });

    return unsubscribe;
  }, [navigation]);

  const loadRecommendations = async () => {
    const rec = await aiAgentService.getRecommendations();
    setRecommendation(rec);

    if (rec.suggestedOrder.length > 0) {
      const all = await taskService.getAllTasks();
      const ordered = rec.suggestedOrder
        .map(id => all.find(t => t.id === id))
        .filter((t): t is Task => t !== undefined);
      setOrderedHomeworks(ordered);
    } else {
      setOrderedHomeworks([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecommendations();
    setRefreshing(false);
  };

  // 获取卡片颜色
  const getCardColor = (index: number) => {
    const colors = [Colors.cardOrange, Colors.cardPink, Colors.cardBlue, Colors.cardGreen];
    return colors[index % colors.length];
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {/* 标题卡片 */}
        <View style={[styles.headerCard, { backgroundColor: Colors.cardBlue }]}>
          <Text style={styles.headerTitle}>🤖 AI Recommendations</Text>
          <Text style={styles.headerSubtitle}>Smart sorting based on priority and deadlines</Text>
        </View>

        {recommendation && (
          <>
            {/* 推荐理由 */}
            {recommendation.reasoning && (
              <View style={styles.reasoningCard}>
                <Text style={styles.cardTitle}>💡 Reasoning</Text>
                <Text style={styles.reasoningText}>{recommendation.reasoning}</Text>
              </View>
            )}

            {/* 提示建议 */}
            {recommendation.tips && recommendation.tips.length > 0 && (
              <View style={styles.tipsCard}>
                <Text style={styles.cardTitle}>✨ Tips & Suggestions</Text>
                {recommendation.tips.map((tip, index) => (
                  <View key={index} style={styles.tipItem}>
                    <View style={styles.tipBullet} />
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* 推荐完成顺序 */}
            {orderedHomeworks.length > 0 && (
              <View style={styles.orderCard}>
                <Text style={styles.cardTitle}>📋 Recommended Order</Text>
                {orderedHomeworks.map((homework, index) => (
                  <TouchableOpacity
                    key={homework.id}
                    style={[styles.orderItem, { backgroundColor: getCardColor(index) }]}
                    onPress={() => {
                      (navigation as any).getParent()?.navigate('HomeworkDetail', { homeworkId: homework.id });
                    }}
                  >
                    <View style={styles.orderNumber}>
                      <Text style={styles.orderNumberText}>{index + 1}</Text>
                    </View>
                    <View style={styles.orderContent}>
                      <Text style={styles.orderTitle}>{homework.title}</Text>
                      <Text style={styles.orderSubject}>{homework.subject || homework.category}</Text>
                    </View>
                    {index === 0 && recommendation.focusTask === homework.id && (
                      <View style={styles.focusBadge}>
                        <Text style={styles.focusBadgeText}>Priority</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        {orderedHomeworks.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={styles.emptyText}>No pending tasks</Text>
            <Text style={styles.emptySubtext}>Keep up the great work!</Text>
          </View>
        )}
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
  headerCard: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
  },
  reasoningCard: {
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  reasoningText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  tipsCard: {
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 8,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  orderCard: {
    marginBottom: 20,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
  },
  orderNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  orderNumberText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderContent: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  orderSubject: {
    fontSize: 14,
    color: Colors.textLight,
  },
  focusBadge: {
    backgroundColor: Colors.inProgress,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  focusBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: Colors.card,
    padding: 60,
    borderRadius: 20,
    alignItems: 'center',
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
