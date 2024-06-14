import { Header, TooltipWithKeys, useTooltipModifiers } from '@voiceflow/ui-next';
import React from 'react';

import { getHotkeyLabel, Hotkey } from '@/keymap';

interface RunButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  loading?: boolean;
}

const RunButton: React.FC<RunButtonProps> = ({ loading = false, onClick, active = false }) => {
  const modifiers = useTooltipModifiers([{ name: 'offset', options: { offset: [0, 11] } }]);

  return (
    <TooltipWithKeys
      text="Run"
      hotkeys={[{ label: getHotkeyLabel(Hotkey.RUN_MODE) }]}
      modifiers={modifiers}
      placement="bottom"
      referenceElement={({ ref, onOpen, onClose }) => (
        <Header.Button.Primary
          ref={ref}
          label="Run"
          onClick={onClick}
          iconName="PlayS"
          isActive={active}
          isLoading={loading}
          onMouseEnter={onOpen}
          onMouseLeave={onClose}
        />
      )}
    />
  );
};

export default RunButton;
