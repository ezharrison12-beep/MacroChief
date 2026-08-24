import { Platform } from 'react-native';
import { HEALTH_PROVIDERS, mergeHealthActivities } from './healthIntegrations';
import { requestAppleHealthAccess, readTodayAppleHealthWorkouts, APPLE_HEALTH_AVAILABLE } from './appleHealth';

export async function connectAppleHealth(currentActivities = []) {
  if (Platform.OS !== 'ios' || !APPLE_HEALTH_AVAILABLE) {
    return { ok: false, reason: 'Apple Health is available only in a native iOS build.' };
  }

  try {
    const permission = await requestAppleHealthAccess();
    if (!permission.granted) return { ok: false, reason: permission.reason || 'Permission was not granted.' };
    const workouts = await readTodayAppleHealthWorkouts();
    return {
      ok: true,
      provider: HEALTH_PROVIDERS.find(provider => provider.id === 'apple-health'),
      activities: mergeHealthActivities(currentActivities, workouts.map(workout => ({
        provider: 'apple-health',
        externalId: workout.id,
        date: workout.date,
        activityType: workout.activityType,
        durationMinutes: workout.durationMinutes,
        activeCalories: workout.activeCalories,
        source: 'Apple Health'
      })))
    };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : 'Apple Health connection failed.' };
  }
}
