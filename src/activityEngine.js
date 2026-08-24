export const WORKOUT_TYPES = [
  { id: 'strength', label: 'Strength training', caloriesPerMinute: 7 },
  { id: 'running', label: 'Running', caloriesPerMinute: 11 },
  { id: 'cycling', label: 'Cycling', caloriesPerMinute: 9 },
  { id: 'walking', label: 'Walking', caloriesPerMinute: 4 },
  { id: 'swimming', label: 'Swimming', caloriesPerMinute: 9 },
  { id: 'sports', label: 'Sports', caloriesPerMinute: 8 }
];

export function estimateWorkoutCalories(type, minutes, weightKg) {
  const workout = WORKOUT_TYPES.find(x => x.id === type) || WORKOUT_TYPES[0];
  const minutesNumber = Math.max(0, Number(minutes) || 0);
  const weight = Math.max(40, Number(weightKg) || 70);
  return Math.round(workout.caloriesPerMinute * minutesNumber * (weight / 70));
}

export function calculateActivityAdjustment(baseCalories, workouts) {
  const burned = workouts.reduce((sum, workout) => sum + (Number(workout.calories) || 0), 0);
  return { burned, adjustedCalories: Math.round(baseCalories + burned) };
}
