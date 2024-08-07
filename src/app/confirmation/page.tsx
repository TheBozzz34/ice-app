"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Confirmation = () => {
  const router = useRouter();
  const [parsedMathDetails, setParsedMathDetails] = useState<string[]>([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const mathDetails = searchParams.get('mathDetails');
    if (mathDetails) {
      setParsedMathDetails(JSON.parse(mathDetails));
    }
  }, []);

  return (
    <div className="p-4">
      <h3 className="text-2xl font-bold tracking-tight">Confirmation Page</h3>
      <h4 className="text-xl font-semibold">Math Details</h4>
      <ul>
        {parsedMathDetails.map((detail, index) => (
          <li key={index}>{detail}</li>
        ))}
      </ul>
    </div>
  );
};

export default Confirmation;
