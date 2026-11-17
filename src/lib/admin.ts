import { useEffect, useState } from 'react';
import { supabase } from './supabase';

// Is the signed-in person an admin? (Only used to show or hide buttons.
// The real protection is in the database.)
export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;
    supabase.rpc('is_admin').then(({ data }) => {
      if (!alive) return;
      setIsAdmin(data === true);
      setChecking(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  return { isAdmin, checking };
}

export type Draft = {
  title: string;
  country: string;
  level: string;
  funding: string;
  deadline: string; // YYYY-MM-DD, or empty for "open"
  description: string;
  eligibility: string;
  howToApply: string;
  applyUrl: string;
  postedBy: string;
};

export const emptyDraft: Draft = {
  title: '',
  country: '',
  level: '',
  funding: '',
  deadline: '',
  description: '',
  eligibility: '',
  howToApply: '',
  applyUrl: '',
  postedBy: 'Pathway team',
};

export type AdminRow = {
  id: string;
  title: string;
  country: string;
  level: string;
  deadline: string | null;
  expired: boolean;
};

const today = () => new Date().toISOString().slice(0, 10);

// Every scholarship, including expired ones.
export async function fetchAdminList(): Promise<AdminRow[]> {
  const { data, error } = await supabase
    .from('scholarships')
    .select('id, title, country, level, deadline')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    id: String(r.id),
    title: r.title,
    country: r.country,
    level: r.level,
    deadline: r.deadline,
    expired: !!r.deadline && r.deadline < today(),
  }));
}

export async function fetchDraft(id: string): Promise<Draft | null> {
  const { data, error } = await supabase
    .from('scholarships')
    .select('*')
    .eq('id', Number(id))
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    title: data.title ?? '',
    country: data.country ?? '',
    level: data.level ?? '',
    funding: data.funding ?? '',
    deadline: data.deadline ?? '',
    description: data.description ?? '',
    eligibility: data.eligibility ?? '',
    howToApply: data.how_to_apply ?? '',
    applyUrl: data.apply_url ?? '',
    postedBy: data.posted_by ?? '',
  };
}

const orNull = (s: string) => (s.trim() === '' ? null : s.trim());

// Add a new scholarship, or update one when an id is given.
export async function saveScholarship(d: Draft, id?: string) {
  const row = {
    title: d.title.trim(),
    country: d.country.trim(),
    level: d.level,
    funding: orNull(d.funding),
    deadline: orNull(d.deadline),
    description: orNull(d.description),
    eligibility: orNull(d.eligibility),
    how_to_apply: orNull(d.howToApply),
    apply_url: orNull(d.applyUrl),
    posted_by: orNull(d.postedBy),
  };

  if (id) {
    const { data, error } = await supabase
      .from('scholarships')
      .update(row)
      .eq('id', Number(id))
      .select('id');
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Not allowed, or this scholarship no longer exists.');
  } else {
    const { error } = await supabase.from('scholarships').insert(row);
    if (error) throw error;
  }
}

export async function deleteScholarship(id: string) {
  const { data, error } = await supabase
    .from('scholarships')
    .delete()
    .eq('id', Number(id))
    .select('id');
  if (error) throw error;
  if (!data || data.length === 0) throw new Error('Not allowed, or already deleted.');
}