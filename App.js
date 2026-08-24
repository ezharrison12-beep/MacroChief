import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const initialGoals = {
  calories: 2600,
  protein: 180,
  carbs: 280,
  fat: 80,
};

export default function App() {
  const [goals] = useState(initialGoals);
  const [logged, setLogged] = useState({ calories: 1420, protein: 112, carbs: 146, fat: 42 });

  const remaining = useMemo(() => ({
    calories: Math.max(goals.calories - logged.calories, 0),
    protein: Math.max(goals.protein - logged.protein, 0),
    carbs: Math.max(goals.carbs - logged.carbs, 0),
    fat: Math.max(goals.fat - logged.fat, 0),
  }), [goals, logged]);

  const addMeal = () => {
    setLogged((current) => ({
      calories: current.calories + 520,
      protein: current.protein + 38,
      carbs: current.carbs + 54,
      fat: current.fat + 16,
    }));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>MACROCHIEF</Text>
            <Text style={styles.title}>Your nutrition, simplified.</Text>
          </View>
          <View style={styles.avatar}><Text style={styles.avatarText}>M</Text></View>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.cardLabel}>TODAY</Text>
          <Text style={styles.calories}>{logged.calories.toLocaleString()}</Text>
          <Text style={styles.muted}>of {goals.calories.toLocaleString()} calories</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.min(logged.calories / goals.calories, 1) * 100}%` }]} />
          </View>
          <Text style={styles.remaining}>{remaining.calories.toLocaleString()} calories remaining</Text>
        </View>

        <Text style={styles.sectionTitle}>Your macros</Text>
        <View style={styles.macroGrid}>
          <MacroCard label="Protein" value={logged.protein} goal={goals.protein} unit="g" />
          <MacroCard label="Carbs" value={logged.carbs} goal={goals.carbs} unit="g" />
          <MacroCard label="Fat" value={logged.fat} goal={goals.fat} unit="g" />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick actions</Text>
        </View>
        <View style={styles.actions}>
          <Action title="Log a meal" subtitle="Add food & macros" onPress={addMeal} />
          <Action title="Build a recipe" subtitle="Use your targets" onPress={() => {}} />
          <Action title="Track workout" subtitle="Adjust today's target" onPress={() => {}} />
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>MacroChief insight</Text>
          <Text style={styles.insightText}>
            You have {remaining.protein}g of protein left today. A protein-rich meal would help you stay on target.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MacroCard({ label, value, goal, unit }) {
  const percentage = Math.min(value / goal, 1);
  return (
    <View style={styles.macroCard}>
      <Text style={styles.macroLabel}>{label}</Text>
      <Text style={styles.macroValue}>{value}{unit}</Text>
      <Text style={styles.macroGoal}>of {goal}{unit}</Text>
      <View style={styles.smallTrack}>
        <View style={[styles.smallFill, { width: `${percentage * 100}%` }]} />
      </View>
    </View>
  );
}

function Action({ title, subtitle, onPress }) {
  return (
    <Pressable style={({ pressed }) => [styles.action, pressed && styles.pressed]} onPress={onPress}>
      <View>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0B0F14' },
  container: { padding: 22, paddingBottom: 48 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  eyebrow: { color: '#7EE787', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { color: '#F5F7FA', fontSize: 25, fontWeight: '800', marginTop: 7, maxWidth: 270 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#17202B', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#273444' },
  avatarText: { color: '#7EE787', fontWeight: '800', fontSize: 18 },
  heroCard: { backgroundColor: '#121923', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#202C3A' },
  cardLabel: { color: '#8A97A8', fontSize: 12, fontWeight: '800', letterSpacing: 1.5 },
  calories: { color: '#FFFFFF', fontSize: 48, fontWeight: '900', marginTop: 8 },
  muted: { color: '#8A97A8', fontSize: 14 },
  progressTrack: { height: 10, backgroundColor: '#222D3A', borderRadius: 5, marginTop: 20, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#7EE787', borderRadius: 5 },
  remaining: { color: '#C4CDD8', marginTop: 12, fontSize: 14 },
  sectionTitle: { color: '#F5F7FA', fontSize: 19, fontWeight: '800', marginTop: 28, marginBottom: 14 },
  macroGrid: { flexDirection: 'row', gap: 10 },
  macroCard: { flex: 1, backgroundColor: '#121923', borderRadius: 18, padding: 15, borderWidth: 1, borderColor: '#202C3A' },
  macroLabel: { color: '#8A97A8', fontSize: 12, fontWeight: '700' },
  macroValue: { color: '#FFFFFF', fontSize: 22, fontWeight: '900', marginTop: 8 },
  macroGoal: { color: '#667386', fontSize: 11, marginTop: 2 },
  smallTrack: { height: 5, backgroundColor: '#222D3A', borderRadius: 3, marginTop: 12, overflow: 'hidden' },
  smallFill: { height: '100%', backgroundColor: '#7EE787', borderRadius: 3 },
  sectionHeader: { marginTop: 2 },
  actions: { gap: 10 },
  action: { backgroundColor: '#121923', borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#202C3A' },
  pressed: { opacity: 0.7 },
  actionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  actionSubtitle: { color: '#7E8B9B', fontSize: 13, marginTop: 4 },
  arrow: { color: '#7EE787', fontSize: 28, fontWeight: '300' },
  insightCard: { marginTop: 20, backgroundColor: '#102019', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: '#1D4430' },
  insightTitle: { color: '#7EE787', fontSize: 14, fontWeight: '800' },
  insightText: { color: '#C8D5CC', fontSize: 14, lineHeight: 21, marginTop: 8 }
});
