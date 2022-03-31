import { useLinkedState } from '@ui/hooks/linked';
import { createStandardShadeFromHue } from '@ui/utils/colors/hsl';
import { hexToHsluv } from '@ui/utils/colors/hsluv';
import React from 'react';
import styled from 'styled-components';

import { usePopper } from '../../../../hooks';
import Box from '../../../Box';
import Portal from '../../../Portal';
import { Tag } from '../../../Tag';
import { IColor } from '../../constants';
import { Label, PopperContent, Wrapper } from '../../styles';
import { ColorRange } from '../ColorRange';
import { ColorThemes } from '../ColorThemes';

const StyledWrapper = styled(Wrapper)`
  position: absolute;
  width: 255px;
  top: 0px;
  left: 0px;
`;

interface ColorPickerPopperProps {
  colors: IColor[];
  tagName?: string;
  selectedColor: string;
  onChange: (color: string) => void;
  onSaveColor?: (color: IColor) => void;
}

// eslint-disable-next-line import/prefer-default-export
export const ColorPickerPopper = React.forwardRef<HTMLDivElement, ColorPickerPopperProps>(
  ({ selectedColor, onChange, tagName = 'my_variable', colors }, ref) => {
    const [selectedHue] = React.useMemo(() => hexToHsluv(selectedColor), [selectedColor]);
    const [localHue, setLocalHue] = useLinkedState(String(selectedHue));

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
                <Tag color={selectedColor}>{tagName}</Tag>
                <Box width={200} mb={22} mt={5}>
                  <ColorRange
                    hue={localHue}
                    setHue={(hue) => {
                      setLocalHue(hue);
                      onChange(createStandardShadeFromHue(hue));
                    }}
                  />
                </Box>
                <Label>Color themes</Label>
                <ColorThemes colors={colors} selectedColor={selectedColor} onColorSelect={onChange} />
              </PopperContent>
            </StyledWrapper>
          </div>
        </Portal>
      </div>
    );
  }
);
