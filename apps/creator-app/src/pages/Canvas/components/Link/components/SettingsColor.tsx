import { COLOR_PICKER_CONSTANTS } from '@voiceflow/ui';
import React from 'react';

import { CanvasColorPicker } from '@/pages/Canvas/components/CanvasColorPicker';

import Button from './SettingsButton';
import ColorIcon from './SettingsColorIcon';

interface SettingsColorProps {
  color: string;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (color: string) => void;
}

const SettingsColor: React.FC<SettingsColorProps> = ({ color, isOpen, onToggle, onChange }) => {
  return (
    <>
      <Button isActive={isOpen} onClick={onToggle} tooltipTitle="Color">
        <ColorIcon
          color={color}
          gradient="conic-gradient(gold, orange, red, purple, MediumTurquoise, GreenYellow, gold)"
        />
      </Button>

      {isOpen && (
        <CanvasColorPicker
          onChange={onChange}
          modifiers={[{ name: 'offset', options: { offset: [-35, 30] } }]}
          selectedColor={color}
          defaultColorScheme={COLOR_PICKER_CONSTANTS.ColorScheme.LIGHT}
        />
      )}
    </>
  );
};

export default SettingsColor;
