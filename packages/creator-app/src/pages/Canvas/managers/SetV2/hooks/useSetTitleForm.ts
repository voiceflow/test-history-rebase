import { useSetup } from '@voiceflow/ui';
import React from 'react';

const useSetTitleForm = (initialState?: string) => {
  const [stepName, setStepName] = React.useState(initialState);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useSetup(() => {
    if (!stepName) {
      inputRef.current?.focus({ preventScroll: true });
    }
  });

  return { inputRef, stepName, setStepName };
};

export default useSetTitleForm;
