import { COLOR_PICKER_CONSTANTS, ColorThemes } from '@voiceflow/ui';
import React from 'react';

import { customThemesSelector } from '@/ducks/projectV2/selectors/active/base';
import { useSelector } from '@/hooks';

import { Container, List } from './components';

interface ColorsProps {
  onSelect: (color: string) => void;
  selectedColor: string;
  type: 'background' | 'text';
}

const Colors: React.FC<ColorsProps> = ({ onSelect, type, selectedColor }) => {
  const colors = useSelector(customThemesSelector);
  const { DEFAULT_THEMES, DEFAULT_COLORS } = COLOR_PICKER_CONSTANTS;

  return (
    <Container>
      <List>
        <ColorThemes
          colors={[type === 'text' ? DEFAULT_COLORS.dark : DEFAULT_COLORS.light, ...DEFAULT_THEMES, ...colors]}
          selectedColor={`#${selectedColor}`}
          onColorSelect={onSelect}
        />
      </List>
    </Container>
  );
};

export default Colors;
