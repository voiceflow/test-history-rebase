import { useEffect, useState } from 'react';

export const useDelay = (timeout, condition, recallEffect) => {
  const [delayed, updateDelayed] = useState(false);

  useEffect(() => {
    if (!condition) {
      return;
    }

    const tm = setTimeout(() => updateDelayed(true), timeout);

    return () => {
      clearTimeout(tm);
      updateDelayed(false);
    };
  }, recallEffect);

  return delayed;
};
