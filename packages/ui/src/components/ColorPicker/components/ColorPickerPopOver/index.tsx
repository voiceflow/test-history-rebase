/* eslint-disable import/prefer-default-export */
import { stopPropagation } from '@ui/utils';
import React from 'react';
import styled from 'styled-components';

import { Tag } from '../../../Tag';
import { Colors, IColor } from '../../constants';
import { Label, PopperContent, Wrapper } from '../../styles';
import { ColorRange } from '../ColorRange';
import { ColorThemes } from '../ColorThemes';
import { ColorsContainer } from '../ColorThemes/styles';

const StyledWrapper = styled(Wrapper)`
  position: absolute;
  width: 255px;
  top: 0px;
  left: 0px;
`;

const StyledLabel = styled(Label)`
  margin-bottom: 10px;
  display: flex;
`;

interface ColorPickerPopOverProps {
  colors: Colors;
  tagName: string;
  selectedColor: IColor;
  onChange: (color: IColor) => void;
  onSaveColor: (color: IColor) => void;
}

export const ColorPickerPopOver = React.forwardRef<HTMLDivElement, ColorPickerPopOverProps>(
  ({ colors, selectedColor, onChange, onSaveColor, tagName = 'my_variable' }, ref) => (
    <StyledWrapper ref={ref}>
      <PopperContent onClick={stopPropagation(null, true)}>
        {tagName && <Tag palette={selectedColor.palette}>{tagName}</Tag>}
        <ColorRange selectedColor={selectedColor} onSaveColor={(color: IColor) => onSaveColor(color)} onSlide={(color: IColor) => onChange(color)} />
        <ColorsContainer>
          <StyledLabel>Color themes</StyledLabel>
          <ColorThemes selectedColor={selectedColor} onColorSelect={(color: IColor) => onChange(color)} colors={colors} />
        </ColorsContainer>
      </PopperContent>
    </StyledWrapper>
  )
);
