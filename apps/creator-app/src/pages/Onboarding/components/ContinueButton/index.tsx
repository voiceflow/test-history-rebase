import { Button } from '@voiceflow/ui';
import React from 'react';

import { useHotkey } from '@/hooks';
import { Hotkey } from '@/keymap';

interface ContinueButtonProps extends React.PropsWithChildren {
  disabled?: boolean;
  onClick: VoidFunction;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({ disabled, onClick, children }) => {
  useHotkey(
    Hotkey.MULTISTEP_CONTINUE_NEXT_STEP,
    () => {
      if (!disabled) {
        onClick();
      }
    },
    { preventDefault: true }
  );

  return (
    <Button disabled={disabled} onClick={onClick} fullWidth>
      {children}
    </Button>
  );
};

export default ContinueButton;
