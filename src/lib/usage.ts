import { supabase } from './supabase';

// Keep this the same as FREE_DAILY_LIMIT in the server function.
export const FREE_DAILY_LIMIT = 5;

const LAGOS_OFFSET_MS = 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function startOfTodayLagos() {
  const now = Date.now();
  return new Date(Math.floor((now + LAGOS_OFFSET_MS) / DAY_MS) * DAY_MS - LAGOS_OFFSET_MS);
}

// How many free scans are left today? Returns null if we can't tell.
export async function scansLeftToday(): Promise<number | null> {
  const { count, error } = await supabase
    .from('ai_usage')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfTodayLagos().toISOString());

  if (error || count === null) return null;
  return Math.max(FREE_DAILY_LIMIT - count, 0);
}