import { Button } from '@voiceflow/ui';
import React from 'react';

import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';

interface ContinueButtonProps {
  disabled?: boolean;
  onClick: VoidFunction;
}

const ContinueButton: React.OldFC<ContinueButtonProps> = ({ disabled, onClick, children }) => {
  useHotKeys(
    Hotkey.MULTISTEP_CONTINUE_NEXT_STEP,
    () => {
      if (!disabled) {
        onClick();
      }
    },
    { preventDefault: true },
    [disabled, onClick]
  );

  return (
    <Button disabled={disabled} onClick={onClick}>
      {children}
    </Button>
  );
};

export default ContinueButton;
