import { Box, COLOR_PICKER_CONSTANTS, ColorThemes, ColorThemeUnit, isBaseColor, StrictPopperModifiers } from '@voiceflow/ui';
import React from 'react';
import { useDismissable } from 'react-dismissable-layers';

import { ColorPickerPopper } from '@/components/ColorPickerPopper';
import Section, { SectionVariant } from '@/components/Section';
import SlotSelect from '@/components/SlotSelect';

interface TypeAndColorSectionProps {
  type: string | null;
  onChangeType: (type: string) => void;
  name: string;
  color: string;
  saveColor: (color: string) => void;
  colorPopperModifiers?: StrictPopperModifiers;
}

const TypeAndColorSection: React.FC<TypeAndColorSectionProps> = ({
  color,
  colorPopperModifiers = [{ name: 'offset', options: { offset: [-20, -21] } }],
  saveColor,
  name,
  type,
  onChangeType,
}) => {
  const popperContainerRef = React.useRef<HTMLDivElement>(null);
  const [isShowingPicker, togglePopper] = useDismissable(false, { ref: popperContainerRef });

  const { DEFAULT_COLORS, BASE_COLORS, COLOR_WHEEL } = COLOR_PICKER_CONSTANTS;

  return (
    <Section
      dividers={false}
      backgroundColor="#fdfdfd"
      header="Type"
      variant={SectionVariant.QUATERNARY}
      customHeaderStyling={{ paddingTop: '16px' }}
      customContentStyling={{ paddingBottom: '24px' }}
    >
      <Box.FlexApart>
        <Box.Flex flex={2} mr={24}>
          <SlotSelect value={type} onChange={onChangeType} />
        </Box.Flex>

        <Box.Flex>
          <ColorThemes small selectedColor={color} onColorSelect={saveColor} colors={[DEFAULT_COLORS.dark, ...BASE_COLORS]} />
          <ColorThemeUnit
            background={!isBaseColor(color) ? color : COLOR_WHEEL}
            onClick={() => togglePopper()}
            selected={!isBaseColor(color)}
            small
            disableContextMenu
          />

          {isShowingPicker && (
            <ColorPickerPopper
              popperContainerRef={popperContainerRef}
              modifiers={colorPopperModifiers}
              tagName={name}
              selectedColor={color}
              onChange={saveColor}
            />
          )}
        </Box.Flex>
      </Box.FlexApart>
    </Section>
  );
};

export default TypeAndColorSection;
