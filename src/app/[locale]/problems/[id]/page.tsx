import { notFound } from 'next/navigation';
import { getSupabase, isSupabaseConfigured, type Problem } from '@/lib/supabase';
import { ProblemDetail } from '@/components/problems/ProblemDetail';

interface ProblemDetailPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

async function getProblem(id: string): Promise<Problem | null> {
  if (!isSupabaseConfigured()) {
    // Return mock data when Supabase is not configured
    return {
      id,
      title: 'Solar Power Solution for Remote Village Schools',
      description: 'Our village schools in remote areas lack reliable electricity. This affects students\' ability to study after dark and limits access to digital learning resources. We need a sustainable solar power solution that can provide electricity for lighting and basic electronics like tablets or laptops.\n\nConstraints:\n- Limited budget (~$500 per school)\n- Remote location with difficult access\n- Need for low maintenance solution\n- Must withstand monsoon weather\n\nWhat we\'ve tried:\n- Small solar panels, but they weren\'t powerful enough\n- Generator, but fuel costs are too high\n\nSuccess would look like: Reliable 6-8 hours of electricity daily for lighting and charging devices.',
      category: 'technical',
      tags: ['solar', 'education', 'energy', 'rural', 'school'],
      language: 'en',
      location: {
        province: 'karnali',
        district: 'Jumla'
      },
      status: 'open',
      media: [
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=800',
          thumb_url: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=400'
        }
      ],
      score: 24,
      created_at: '2024-01-15T08:30:00Z',
      updated_at: '2024-01-15T08:30:00Z',
      profiles: {
        id: 'user-1',
        display_name: 'Pemba Sherpa',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        role: 'member',
        created_at: '2024-01-01T00:00:00Z'
      }
    } as Problem;
  }

  try {
    const supabase = getSupabase();

    // First fetch the problem
    const { data: problem, error: problemError } = await supabase
      .from('problems')
      .select('*')
      .eq('id', id)
      .single();

    if (problemError) {
      console.error('Error fetching problem:', problemError);
      return null;
    }

    if (!problem) {
      return null;
    }

    // Then fetch the profile if there's an author
    if (problem.author_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, role, created_at')
        .eq('id', problem.author_id)
        .single();

      return { ...problem, profiles: profile || null };
    }

    return problem;
  } catch (error) {
    console.error('Error fetching problem:', error);
    return null;
  }
}

export default async function ProblemDetailPage({ params }: ProblemDetailPageProps) {
  const { id } = await params;

  const problem = await getProblem(id);

  if (!problem) {
    notFound();
  }

  return <ProblemDetail problem={problem} />;
}