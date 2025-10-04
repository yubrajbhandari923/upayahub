import { notFound, redirect } from 'next/navigation';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { ProblemEditForm } from '@/components/forms/ProblemEditForm';

interface ProblemEditPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

async function getProblem(id: string) {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = getSupabase();
    const { data: problem, error } = await supabase
      .from('problems')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !problem) {
      return null;
    }

    return problem;
  } catch (error) {
    console.error('Error fetching problem:', error);
    return null;
  }
}

export default async function ProblemEditPage({ params }: ProblemEditPageProps) {
  const { locale, id } = await params;
  const problem = await getProblem(id);

  if (!problem) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {locale === 'en' ? 'Edit Problem' : 'समस्या सम्पादन गर्नुहोस्'}
        </h1>
        <ProblemEditForm problem={problem} locale={locale} />
      </div>
    </div>
  );
}
