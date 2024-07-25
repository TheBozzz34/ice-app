import React, { useEffect, useState } from 'react';

const KonamiCodeDetector: React.FC<{ onKonamiCode: () => void }> = ({ onKonamiCode }) => {
  const konamiCode = React.useMemo(() => [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'
  ], []);
  const [inputSequence, setInputSequence] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setInputSequence((prevSequence) => [...prevSequence, event.key].slice(-konamiCode.length));
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (inputSequence.join('') === konamiCode.join('')) {
      onKonamiCode();
    }
  }, [inputSequence, konamiCode, onKonamiCode]);

  return null; // This component does not render anything
};

export default KonamiCodeDetector;
