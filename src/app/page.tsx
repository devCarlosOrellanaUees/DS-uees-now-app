"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirige a la ruta /auth cuando se cargue la página
    router.push('/auth/signin');
  }, [router]);

  return null;
}
