import { Utils } from '@voiceflow/common';
import { COLOR_PICKER_CONSTANTS, ColorPickerPopper, normalizeColor, useDebouncedCallback, usePopper } from '@voiceflow/ui';
import React from 'react';

import Button from './SettingsButton';
import ColorIcon from './SettingsColorIcon';

interface SettingsColorProps {
  color: string;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (color: string) => void;
}

const SettingsColor: React.FC<SettingsColorProps> = ({ color, isOpen, onToggle, onChange }) => {
  const debouncedSetColor = useDebouncedCallback(100, (color: string) => onChange(color), []);
  const [selectedHex, setLocalSelectedHex] = React.useState(() => normalizeColor(color));

  const rootPopper = usePopper({
    placement: 'bottom',
    modifiers: [
      { name: 'offset', options: { offset: [0, 5] } },
      { name: 'preventOverflow', options: { boundary: document.body } },
    ],
    strategy: 'fixed',
  });

  return (
    <>
      <Button ref={rootPopper.setReferenceElement} isActive={isOpen} onClick={onToggle} tooltipTitle="Color">
        <ColorIcon color={color} gradient="conic-gradient(gold, orange, red, purple, MediumTurquoise, GreenYellow, gold)" />
      </Button>

      {isOpen && (
        <ColorPickerPopper
          colors={COLOR_PICKER_CONSTANTS.DEFAULT_THEMES}
          defaultColorScheme="light"
          selectedColor={selectedHex}
          onChange={Utils.functional.chain(debouncedSetColor, setLocalSelectedHex)}
          modifiers={[{ name: 'offset', options: { offset: [-160, -29] } }]}
        />
      )}
    </>
  );
};

export default SettingsColor;
