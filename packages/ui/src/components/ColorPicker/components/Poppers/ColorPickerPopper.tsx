/* eslint-disable import/prefer-default-export */
import { usePopper } from '@ui/hooks';
import React from 'react';
import styled from 'styled-components';

import Portal from '../../../Portal';
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

interface ColorPickerPopperProps {
  colors: Colors;
  tagName: string;
  selectedColor: IColor;
  onChange: (color: IColor) => void;
  onSaveColor: (color: IColor) => void;
}

export const ColorPickerPopper = React.forwardRef<HTMLDivElement, ColorPickerPopperProps>(
  ({ colors, selectedColor, onChange, onSaveColor, tagName = 'my_variable' }, ref) => {
    const rootPopper = usePopper({
      placement: 'top-start',
      modifiers: [{ name: 'offset', options: { offset: [-140, 20] } }],
      strategy: 'absolute',
    });

    return (
      <div ref={rootPopper.setReferenceElement}>
        <Portal portalNode={document.body}>
          <div ref={rootPopper.setPopperElement} style={rootPopper.styles.popper} {...rootPopper.attributes.popper}>
            <StyledWrapper ref={ref}>
              <PopperContent>
                {tagName && <Tag palette={selectedColor.palette}>{tagName}</Tag>}
                <ColorRange
                  selectedColor={selectedColor}
                  onSaveColor={(color: IColor) => onSaveColor(color)}
                  onSlide={(color: IColor) => onChange(color)}
                />
                <ColorsContainer>
                  <StyledLabel>Color themes</StyledLabel>
                  <ColorThemes selectedColor={selectedColor} onColorSelect={(color: IColor) => onChange(color)} colors={colors} />
                </ColorsContainer>
              </PopperContent>
            </StyledWrapper>
          </div>
        </Portal>
      </div>
    );
  }
);
