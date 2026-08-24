import { Platform } from 'react-native';
import { normalizeHealthActivity, mergeHealthActivities } from './healthIntegrations';
import { requestAppleHealthAccess, readTodayAppleHealthWorkouts, APPLE_HEALTH_AVAILABLE } from './appleHealth';

export async function connectAppleHealth() {
  if (Platform.OS !== 'ios' || !APPLE_HEALTH_AVAILABLE) {
    return { connected: false, provider: 'apple-health', reason: 'ios-native-build-required' };
  }
  try {
    const permission = await requestAppleHealthAccess();
    if (!permission?.granted) return { connected: false, provider: 'apple-health', reason: permission?.reason || 'permission-denied' };
    const raw = await readTodayAppleHealthWorkouts();
    const activities = raw.map(item => normalizeHealthActivity('apple-health', item));
    return { connected: true, provider: 'apple-health', activities };
  } catch (error) {
    return { connected: false, provider: 'apple-health', reason: error?.message || 'health-sync-failed' };
  }
}

export async function syncAppleHealth(currentActivities = []) {
  const result = await connectAppleHealth();
  if (!result.connected) return result;
  return {
    ...result,
    activities: mergeHealthActivities(currentActivities, result.activities)
  };
}
