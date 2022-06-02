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
        <ColorIcon color={color} gradient="conic-gradient(gold, orange, red, purple, MediumTurquoise, GreenYellow, gold)" />
      </Button>

      {isOpen && (
        <CanvasColorPicker
          defaultColorScheme="light"
          selectedColor={color}
          onChange={onChange}
          modifiers={[{ name: 'offset', options: { offset: [-35, 30] } }]}
        />
      )}
    </>
  );
};

export default SettingsColor;
