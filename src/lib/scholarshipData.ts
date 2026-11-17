import { supabase } from './supabase';

export type Scholarship = {
  id: string;
  title: string;
  country: string;
  level: string;
  funding: string;
  deadline: string;
  postedOn: string;
  postedBy: string;
  description: string;
  eligibility: string;
  howToApply: string;
  applyUrl: string;
  isNew: boolean;
};

export const levelFilters = ['All', 'Undergraduate', "Master's", 'PhD'];

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const formatDate = (iso?: string | null, fallback = 'Not stated') =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : fallback;

function fromRow(r: any): Scholarship {
  return {
    id: String(r.id),
    title: r.title,
    country: r.country,
    level: r.level,
    funding: r.funding ?? 'Funding: see details',
    deadline: formatDate(r.deadline, 'Open'),
    postedOn: formatDate(r.created_at),
    postedBy: r.posted_by ?? 'Pathway team',
    description: r.description ?? 'No description yet.',
    eligibility: r.eligibility ?? 'See the official page.',
    howToApply: r.how_to_apply ?? 'See the official page.',
    applyUrl: r.apply_url ?? '',
    isNew: Date.now() - new Date(r.created_at).getTime() < WEEK_MS,
  };
}

const today = () => new Date().toISOString().slice(0, 10);

// All open scholarships, newest first. Past deadlines are hidden.
export async function fetchScholarships(): Promise<Scholarship[]> {
  const { data, error } = await supabase
    .from('scholarships')
    .select('*')
    .or(`deadline.is.null,deadline.gte.${today()}`)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function fetchScholarship(id: string): Promise<Scholarship | null> {
  const { data, error } = await supabase
    .from('scholarships')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ? fromRow(data) : null;
}

// Did this student save it? (Only their own rows are visible.)
export async function isSaved(id: string): Promise<boolean> {
  const { data } = await supabase
    .from('saved_scholarships')
    .select('scholarship_id')
    .eq('scholarship_id', id)
    .maybeSingle();
  return !!data;
}

export async function setSaved(id: string, saved: boolean) {
  if (saved) {
    const { error } = await supabase
      .from('saved_scholarships')
      .insert({ scholarship_id: Number(id) });
    if (error && error.code !== '23505') throw error; // already saved is fine
  } else {
    const { error } = await supabase
      .from('saved_scholarships')
      .delete()
      .eq('scholarship_id', Number(id));
    if (error) throw error;
  }
}