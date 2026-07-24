/**
 * Hour+minute countdown to a target timestamp, for the retroactive-release
 * card (spec wants "23h 18min", not day-granularity like
 * ProtocolPendingScreen's countdown). Returns null once expired — callers
 * hide themselves rather than showing "0h 0min".
 */
export function computeHmCountdown(target) {
  const diffMs = new Date(target) - new Date();
  if (diffMs <= 0) return null;
  const totalMinutes = Math.floor(diffMs / 60000);
  return { hours: Math.floor(totalMinutes / 60), minutes: totalMinutes % 60 };
}
