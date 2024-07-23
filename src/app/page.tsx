"use client"

import Head from 'next/head';
import useRedirectAfterSomeSeconds from '../hooks/useRedirectAfterSomeSeconds';

export default function ErrorPage() {
  const { secondsRemaining } = useRedirectAfterSomeSeconds('https://icehouseamerica.com', 1);

  return (
    <>
    </>
  );
}