'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function ProfileRedirect() {
  const params = useParams<{ username: string }>();
  useEffect(() => {
    if (params?.username) {
      window.location.replace(`/#/profile/${params.username}`);
    }
  }, [params?.username]);
  return null;
}
