import { COLOR_PICKER_CONSTANTS, ColorThemes } from '@voiceflow/ui';
import React from 'react';

import { customThemesSelector } from '@/ducks/projectV2/selectors/active/base';
import { useSelector } from '@/hooks';

import { Container, List } from './components';

const { ColorScheme, DEFAULT_THEMES, DEFAULT_SCHEME_COLORS } = COLOR_PICKER_CONSTANTS;

interface ColorsProps {
  type: 'background' | 'text';
  onSelect: (color: string) => void;
  selectedColor: string;
}

const Colors: React.FC<ColorsProps> = ({ onSelect, type, selectedColor }) => {
  const colors = useSelector(customThemesSelector);

  const defaultColor = type === 'text' ? DEFAULT_SCHEME_COLORS[ColorScheme.DARK] : DEFAULT_SCHEME_COLORS[ColorScheme.LIGHT];

  return (
    <Container>
      <List>
        <ColorThemes colors={[defaultColor, ...DEFAULT_THEMES, ...colors]} onColorSelect={onSelect} selectedColor={`#${selectedColor}`} />
      </List>
    </Container>
  );
};

export default Colors;
