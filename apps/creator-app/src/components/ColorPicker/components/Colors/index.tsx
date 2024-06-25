import { COLOR_PICKER_CONSTANTS, ColorThemes } from '@voiceflow/ui';
import React from 'react';

import { customThemesSelector } from '@/ducks/projectV2/selectors/active/base';
import { useSelector } from '@/hooks/redux';

import { Container, List } from './components';

const { DEFAULT_THEMES, DEFAULT_SCHEME_COLORS } = COLOR_PICKER_CONSTANTS;

interface ColorsProps {
  onSelect: (color: string) => void;
  colorScheme: COLOR_PICKER_CONSTANTS.ColorScheme;
  selectedColor: string;
}

const Colors: React.FC<ColorsProps> = ({ onSelect, colorScheme, selectedColor }) => {
  const colors = useSelector(customThemesSelector);

  const defaultColor = DEFAULT_SCHEME_COLORS[colorScheme];

  return (
    <Container>
      <List>
        <ColorThemes
          colors={[defaultColor, ...DEFAULT_THEMES, ...colors]}
          onColorSelect={onSelect}
          selectedColor={`#${selectedColor}`}
        />
      </List>
    </Container>
  );
};

export default Colors;
