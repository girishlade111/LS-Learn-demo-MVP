'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export const dynamicParams = false;
export function generateStaticParams() {
  return [];
}

export default function QuestionRedirect() {
  const params = useParams<{ slug: string }>();
  useEffect(() => {
    if (params?.slug) {
      window.location.replace(`/#/question/${params.slug}`);
    }
  }, [params?.slug]);
  return null;
}
