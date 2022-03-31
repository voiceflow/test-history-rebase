/* eslint-disable import/prefer-default-export */
import React from 'react';

import { useColorPalette } from '../ColorPicker/hooks';
import { CurlyBraces, Label, TagWrapper } from './styles';

interface TagProps {
  color: string;
  children: string;
}

export const Tag = ({ color, children }: TagProps): React.ReactElement => {
  const palette = useColorPalette(color);

  return (
    <TagWrapper palette={palette}>
      <CurlyBraces palette={palette}>{`{`}</CurlyBraces>
      <Label palette={palette}>{children}</Label>
      <CurlyBraces palette={palette}>{`}`}</CurlyBraces>
    </TagWrapper>
  );
};
