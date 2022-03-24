/* eslint-disable import/prefer-default-export */
import { HSLShades } from '@ui/utils/colors/hsl';
import React from 'react';

import { CurlyBraces, Label, TagWrapper } from './styles';

interface TagProps {
  palette: HSLShades;
  children: string;
}

export const Tag = ({ palette, children }: TagProps): React.ReactElement => (
  <TagWrapper palette={palette}>
    <CurlyBraces palette={palette}>{`{`}</CurlyBraces>
    <Label palette={palette}>{children}</Label>
    <CurlyBraces palette={palette}>{`}`}</CurlyBraces>
  </TagWrapper>
);
