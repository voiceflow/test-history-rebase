import Box from '@ui/components/Box';
import Portal from '@ui/components/Portal';
import { Tag } from '@ui/components/Tag';
import { StrictPopperModifiers, useLinkedState, usePopper } from '@ui/hooks';
import { styled } from '@ui/styles';
import { stopPropagation } from '@ui/utils';
import { createStandardShadeFromHue } from '@ui/utils/colors/hsl';
import { hexToHsluv } from '@ui/utils/colors/hsluv';
import React from 'react';

import { DEFAULT_COLORS, IColor } from '../../constants';
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
  defaultColorScheme?: 'light' | 'dark';
  modifiers?: StrictPopperModifiers;
}

export const ColorPickerPopper = React.forwardRef<HTMLDivElement, ColorPickerPopperProps>(
  ({ selectedColor, modifiers = [], onChange, tagName, colors, defaultColorScheme = 'dark' }, ref) => {
    const [selectedHue] = React.useMemo(() => hexToHsluv(selectedColor), [selectedColor]);
    const [localHue, setLocalHue] = useLinkedState(String(selectedHue));

    const rootPopper = usePopper({
      placement: 'top-start',
      modifiers: [{ name: 'offset', options: { offset: [-140, 20] } }, ...modifiers],
      strategy: 'absolute',
    });

    return (
      <div ref={rootPopper.setReferenceElement}>
        <Portal portalNode={document.body}>
          <div ref={rootPopper.setPopperElement} style={rootPopper.styles.popper} {...rootPopper.attributes.popper}>
            <StyledWrapper ref={ref}>
              <PopperContent onClick={stopPropagation(null, true)}>
                {tagName && (
                  <Box mb={15}>
                    <Tag color={selectedColor}>{`{${tagName}}`}</Tag>
                  </Box>
                )}

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
                <ColorThemes colors={[DEFAULT_COLORS[defaultColorScheme], ...colors]} selectedColor={selectedColor} onColorSelect={onChange} />
              </PopperContent>
            </StyledWrapper>
          </div>
        </Portal>
      </div>
    );
  }
);
