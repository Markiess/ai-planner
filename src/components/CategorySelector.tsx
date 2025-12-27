import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { TaskCategory } from '../types';
import { Colors } from '../constants/colors';

interface CategorySelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (category: TaskCategory) => void;
}

const CATEGORIES: Array<{ id: TaskCategory; label: string; icon: string; color: string }> = [
  { id: 'homework', label: 'Homework', icon: '📚', color: Colors.categoryHomework },
  { id: 'work', label: 'Work', icon: '💼', color: Colors.categoryWork },
  { id: 'sports', label: 'Sports', icon: '⚽', color: Colors.categorySports },
  { id: 'shopping', label: 'Shopping', icon: '🛒', color: Colors.categoryShopping },
  { id: 'transport', label: 'Transport', icon: '🚗', color: Colors.categoryTransport },
  { id: 'daily', label: 'Daily', icon: '🌅', color: Colors.categoryDaily },
];

export function CategorySelector({ visible, onClose, onSelect }: CategorySelectorProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Select Category</Text>
          <View style={styles.grid}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, { backgroundColor: category.color + '20' }]}
                onPress={() => {
                  onSelect(category.id);
                  onClose();
                }}
              >
                <Text style={styles.icon}>{category.icon}</Text>
                <Text style={styles.label}>{category.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    aspectRatio: 1.2,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  icon: {
    fontSize: 48,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
});

