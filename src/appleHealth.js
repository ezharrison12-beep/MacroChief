import { Platform } from 'react-native';

let healthkit = null;
try {
  healthkit = require('@kingstinct/react-native-healthkit');
} catch (_) {
  healthkit = null;
}

export const APPLE_HEALTH_AVAILABLE = Platform.OS === 'ios' && Boolean(healthkit);

export async function requestAppleHealthAccess() {
  if (!APPLE_HEALTH_AVAILABLE) return { granted: false, reason: 'ios-only' };
  const { initializeHealthKit, requestAuthorization } = healthkit;
  await initializeHealthKit({
    HKQuantityTypeIdentifierActiveEnergyBurned: { access: 'read' },
    HKQuantityTypeIdentifierStepCount: { access: 'read' },
    HKQuantityTypeIdentifierDistanceWalkingRunning: { access: 'read' },
    HKWorkoutTypeIdentifier: { access: 'read' }
  });
  await requestAuthorization();
  return { granted: true };
}

export async function readTodayAppleHealthWorkouts() {
  if (!APPLE_HEALTH_AVAILABLE) return [];
  const { getAnchoredWorkouts } = healthkit;
  if (!getAnchoredWorkouts) return [];
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  const result = await getAnchoredWorkouts({ startDate: startDate.toISOString() });
  const workouts = result?.workouts || result || [];
  return workouts.map(workout => ({
    id: workout.uuid || workout.id,
    date: new Date(workout.startDate || workout.date || Date.now()).toISOString().slice(0, 10),
    activityType: workout.workoutActivityType || workout.activityType || 'Workout',
    durationMinutes: Math.round((Number(workout.duration) || 0) / 60),
    activeCalories: Math.round(Number(workout.totalEnergyBurned?.quantity || workout.calories || 0)),
    source: 'Apple Health'
  }));
}
