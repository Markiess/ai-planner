// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { TabParamList, RootStackParamList } from '../navigation/AppNavigator';
// import { taskService } from '../services/taskService';
// import { aiAgentService } from '../services/aiAgentService';
// import { Task, AIRecommendation } from '../types';
// import { Colors } from '../constants/colors';
// import { format, addDays, subDays } from 'date-fns';
// import { GanttChart } from '../components/GanttChart';

// type Props = NativeStackScreenProps<TabParamList, 'Home'>;

// export function HomeScreen({ navigation }: Props) {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
//   const [pendingCount, setPendingCount] = useState(0);
//   const [inProgressCount, setInProgressCount] = useState(0);
//   const [completedCount, setCompletedCount] = useState(0);

//   useEffect(() => {
//     loadData();
    
//     const unsubscribe = navigation.addListener('focus', () => {
//       loadData();
//     });

//     return unsubscribe;
//   }, [navigation, selectedDate]);

//   const loadData = async () => {
//     const dateTasks = await taskService.getTasksForDate(selectedDate);
//     setTasks(dateTasks);
    
//     const pending = dateTasks.filter(t => t.status === 'pending');
//     const inProgress = dateTasks.filter(t => t.status === 'in-progress');
//     const completed = dateTasks.filter(t => t.status === 'completed');
    
//     setPendingCount(pending.length);
//     setInProgressCount(inProgress.length);
//     setCompletedCount(completed.length);

//     const rec = await aiAgentService.getRecommendations(selectedDate);
//     setRecommendation(rec);
//   };

//   const handleTaskPress = (task: Task) => {
//     (navigation as any).getParent()?.navigate('HomeworkDetail', { homeworkId: task.id });
//   };

//   const handleSmartReschedule = async () => {
//     try {
//       await aiAgentService.smartReschedule(selectedDate);
//       loadData();
//     } catch (error) {
//       console.error('Reschedule failed:', error);
//     }
//   };

//   const changeDate = (days: number) => {
//     setSelectedDate(prev => {
//       const newDate = new Date(prev);
//       newDate.setDate(newDate.getDate() + days);
//       return newDate;
//     });
//   };

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* Top Bar: Date Selector + AI Brief */}
//       <View style={styles.topBar}>
//         <View style={styles.dateSelector}>
//           <TouchableOpacity onPress={() => changeDate(-1)} style={styles.dateButton}>
//             <Text style={styles.dateButtonText}>‹</Text>
//           </TouchableOpacity>
//           <View style={styles.dateDisplay}>
//             <Text style={styles.dateText}>{format(selectedDate, 'EEEE, MMM d')}</Text>
//             <Text style={styles.dateYear}>{format(selectedDate, 'yyyy')}</Text>
//           </View>
//           <TouchableOpacity onPress={() => changeDate(1)} style={styles.dateButton}>
//             <Text style={styles.dateButtonText}>›</Text>
//           </TouchableOpacity>
//         </View>
        
//         {recommendation?.dailyBrief && (
//           <View style={styles.aiBrief}>
//             <Text style={styles.aiBriefText}>🤖 {recommendation.dailyBrief}</Text>
//           </View>
//         )}
//       </View>

//       {/* Quick Stats */}
//       <View style={styles.statsContainer}>
//         <View style={[styles.statCard, { backgroundColor: Colors.todoLight }]}>
//           <Text style={styles.statNumber}>{pendingCount}</Text>
//           <Text style={styles.statLabel}>To Do</Text>
//         </View>
//         <View style={[styles.statCard, { backgroundColor: Colors.inProgressLight }]}>
//           <Text style={styles.statNumber}>{inProgressCount}</Text>
//           <Text style={styles.statLabel}>In Progress</Text>
//         </View>
//         <View style={[styles.statCard, { backgroundColor: Colors.doneLight }]}>
//           <Text style={styles.statNumber}>{completedCount}</Text>
//           <Text style={styles.statLabel}>Done</Text>
//         </View>
//       </View>

//       {/* Gantt Chart - Main View */}
//       <View style={styles.ganttSection}>
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Timeline</Text>
//           <TouchableOpacity onPress={handleSmartReschedule} style={styles.smartButton}>
//             <Text style={styles.smartButtonText}>✨ Smart Reschedule</Text>
//           </TouchableOpacity>
//         </View>
        
//         {recommendation?.conflicts && recommendation.conflicts.length > 0 && (
//           <View style={styles.conflictWarning}>
//             <Text style={styles.conflictText}>
//               ⚠️ {recommendation.conflicts.length} time conflict(s) detected
//             </Text>
//           </View>
//         )}
        
//         <GanttChart
//           tasks={tasks}
//           selectedDate={selectedDate}
//           onTaskPress={handleTaskPress}
//           conflicts={recommendation?.conflicts || []}
//         />
//       </View>

//       {/* Recommended Task */}
//       {recommendation?.focusTask && (
//         <View style={styles.recommendedSection}>
//           <Text style={styles.sectionTitle}>Recommended Focus</Text>
//           {(() => {
//             const focusTask = tasks.find(t => t.id === recommendation.focusTask);
//             if (!focusTask) return null;
            
//             return (
//               <TouchableOpacity
//                 style={[styles.recommendedCard, { backgroundColor: Colors.cardBlue }]}
//                 onPress={() => handleTaskPress(focusTask)}
//               >
//                 <Text style={styles.recommendedTitle}>{focusTask.title}</Text>
//                 <Text style={styles.recommendedReason}>{recommendation.reasoning}</Text>
//               </TouchableOpacity>
//             );
//           })()}
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },
//   topBar: {
//     padding: 16,
//     paddingTop: 60,
//     backgroundColor: Colors.card,
//   },
//   dateSelector: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 16,
//   },
//   dateButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: Colors.background,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   dateButtonText: {
//     fontSize: 24,
//     color: Colors.text,
//     fontWeight: 'bold',
//   },
//   dateDisplay: {
//     marginHorizontal: 20,
//     alignItems: 'center',
//   },
//   dateText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: Colors.text,
//   },
//   dateYear: {
//     fontSize: 14,
//     color: Colors.textLight,
//     marginTop: 2,
//   },
//   aiBrief: {
//     backgroundColor: Colors.cardBlue,
//     padding: 12,
//     borderRadius: 12,
//   },
//   aiBriefText: {
//     fontSize: 14,
//     color: Colors.text,
//     textAlign: 'center',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     padding: 16,
//     gap: 12,
//   },
//   statCard: {
//     flex: 1,
//     padding: 16,
//     borderRadius: 16,
//     alignItems: 'center',
//   },
//   statNumber: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: Colors.text,
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: Colors.textLight,
//     fontWeight: '500',
//   },
//   ganttSection: {
//     padding: 16,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: Colors.text,
//   },
//   smartButton: {
//     backgroundColor: Colors.primary,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   smartButtonText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   conflictWarning: {
//     backgroundColor: Colors.todoLight,
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 12,
//   },
//   conflictText: {
//     fontSize: 14,
//     color: Colors.todo,
//     fontWeight: '500',
//   },
//   recommendedSection: {
//     padding: 16,
//   },
//   recommendedCard: {
//     padding: 20,
//     borderRadius: 16,
//     marginTop: 12,
//   },
//   recommendedTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: Colors.text,
//     marginBottom: 8,
//   },
//   recommendedReason: {
//     fontSize: 14,
//     color: Colors.textLight,
//     lineHeight: 20,
//   },
// });


import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TabParamList } from '../navigation/AppNavigator';
import { taskService } from '../services/taskService';
import { aiAgentService } from '../services/aiAgentService';
import { Task, AIRecommendation } from '../types';
import { Colors } from '../constants/colors';
import { format } from 'date-fns';
import { GanttChart } from '../components/GanttChart';

type Props = NativeStackScreenProps<TabParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    loadData();

    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation, selectedDate]);

  const loadData = async () => {
    const dateTasks = await taskService.getTasksForDate(selectedDate);
    setTasks(dateTasks);

    const pending = dateTasks.filter(t => t.status === 'pending');
    const inProgress = dateTasks.filter(t => t.status === 'in-progress');
    const completed = dateTasks.filter(t => t.status === 'completed');

    setPendingCount(pending.length);
    setInProgressCount(inProgress.length);
    setCompletedCount(completed.length);

    const rec = await aiAgentService.getRecommendations(selectedDate);
    setRecommendation(rec);
  };

  const handleTaskPress = (task: Task) => {
    (navigation as any).getParent()?.navigate('HomeworkDetail', { homeworkId: task.id });
  };

  const handleSmartReschedule = async () => {
    try {
      await aiAgentService.smartReschedule(selectedDate);
      loadData();
    } catch (error) {
      console.error('Reschedule failed:', error);
    }
  };

  const changeDate = (days: number) => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Bar: Date Selector + AI Brief */}
        <View style={styles.topBar}>
          <View style={styles.dateSelector}>
            <TouchableOpacity onPress={() => changeDate(-1)} style={styles.dateButton}>
              <Text style={styles.dateButtonText}>‹</Text>
            </TouchableOpacity>
            <View style={styles.dateDisplay}>
              <Text style={styles.dateText}>{format(selectedDate, 'EEEE, MMM d')}</Text>
              <Text style={styles.dateYear}>{format(selectedDate, 'yyyy')}</Text>
            </View>
            <TouchableOpacity onPress={() => changeDate(1)} style={styles.dateButton}>
              <Text style={styles.dateButtonText}>›</Text>
            </TouchableOpacity>
          </View>

          {recommendation?.dailyBrief && (
            <View style={styles.aiBrief}>
              <Text style={styles.aiBriefText}>🤖 {recommendation.dailyBrief}</Text>
            </View>
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: Colors.todoLight }]}>
            <Text style={styles.statNumber}>{pendingCount}</Text>
            <Text style={styles.statLabel}>To Do</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.inProgressLight }]}>
            <Text style={styles.statNumber}>{inProgressCount}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.doneLight }]}>
            <Text style={styles.statNumber}>{completedCount}</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
        </View>

        {/* Gantt Chart - Main View */}
        <View style={styles.ganttSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Timeline</Text>
            <TouchableOpacity onPress={handleSmartReschedule} style={styles.smartButton}>
              <Text style={styles.smartButtonText}>✨ Smart Reschedule</Text>
            </TouchableOpacity>
          </View>

          {recommendation?.conflicts && recommendation.conflicts.length > 0 && (
            <View style={styles.conflictWarning}>
              <Text style={styles.conflictText}>
                ⚠️ {recommendation.conflicts.length} time conflict(s) detected
              </Text>
            </View>
          )}

          <GanttChart
            tasks={tasks}
            selectedDate={selectedDate}
            onTaskPress={handleTaskPress}
            conflicts={recommendation?.conflicts || []}
          />
        </View>

        {/* Recommended Task */}
        {recommendation?.focusTask && (
          <View style={styles.recommendedSection}>
            <Text style={styles.sectionTitle}>Recommended Focus</Text>
            {(() => {
              const focusTask = tasks.find(t => t.id === recommendation.focusTask);
              if (!focusTask) return null;

              return (
                <TouchableOpacity
                  style={[styles.recommendedCard, { backgroundColor: Colors.cardBlue }]}
                  onPress={() => handleTaskPress(focusTask)}
                >
                  <Text style={styles.recommendedTitle}>{focusTask.title}</Text>
                  <Text style={styles.recommendedReason}>{recommendation.reasoning}</Text>
                </TouchableOpacity>
              );
            })()}
          </View>
        )}

        {/* 留底部空间，防止按钮挡住内容 */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 底部居中添加按钮 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddHomework')}
      >
        <Text style={styles.addButtonText}>＋ Add TODO</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: Colors.card,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  dateButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 24,
    color: Colors.text,
    fontWeight: 'bold',
  },
  dateDisplay: {
    marginHorizontal: 20,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  dateYear: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 2,
  },
  aiBrief: {
    backgroundColor: Colors.cardBlue,
    padding: 12,
    borderRadius: 12,
  },
  aiBriefText: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500',
  },
  ganttSection: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  smartButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  smartButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  conflictWarning: {
    backgroundColor: Colors.todoLight,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  conflictText: {
    fontSize: 14,
    color: Colors.todo,
    fontWeight: '500',
  },
  recommendedSection: {
    padding: 16,
  },
  recommendedCard: {
    padding: 20,
    borderRadius: 16,
    marginTop: 12,
  },
  recommendedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  recommendedReason: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
