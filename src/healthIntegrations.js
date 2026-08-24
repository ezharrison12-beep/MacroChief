export const HEALTH_PROVIDERS = [
  { id: 'apple-health', name: 'Apple Health', platforms: ['ios'], status: 'native-permission' },
  { id: 'fitbit', name: 'Fitbit', platforms: ['ios', 'android'], status: 'oauth' },
  { id: 'garmin', name: 'Garmin', platforms: ['ios', 'android'], status: 'developer-access' },
  { id: 'health-connect', name: 'Health Connect', platforms: ['android'], status: 'native-permission' }
];

export function normalizeHealthActivity(provider, data = {}) {
  return {
    provider,
    externalId: data.externalId || data.id || `${provider}-${Date.now()}`,
    date: data.date || new Date().toISOString().slice(0, 10),
    activityType: data.activityType || data.type || 'activity',
    durationMinutes: Number(data.durationMinutes || data.duration || 0),
    activeCalories: Math.max(0, Number(data.activeCalories || data.calories || 0)),
    steps: Math.max(0, Number(data.steps || 0)),
    distanceMeters: Math.max(0, Number(data.distanceMeters || data.distance || 0)),
    source: data.source || provider
  };
}

export function mergeHealthActivities(current, incoming) {
  const map = new Map(current.map(item => [item.externalId, item]));
  incoming.map(normalizeHealthActivity).forEach(item => map.set(item.externalId, item));
  return Array.from(map.values()).sort((a, b) => b.date.localeCompare(a.date));
}

export function calculateImportedActivityCalories(activities, date = new Date().toISOString().slice(0, 10)) {
  return activities
    .filter(activity => activity.date === date)
    .reduce((sum, activity) => sum + (Number(activity.activeCalories) || 0), 0);
}
