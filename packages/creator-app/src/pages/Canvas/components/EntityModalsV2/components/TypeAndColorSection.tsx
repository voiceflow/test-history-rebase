import { Box, COLOR_PICKER_CONSTANTS, ColorThemes, ColorThemeUnit, isBaseOrSchemeColor, StrictPopperModifiers } from '@voiceflow/ui';
import React from 'react';
import { useDismissable } from 'react-dismissable-layers';

import { ColorPickerPopper } from '@/components/ColorPickerPopper';
import Section, { SectionVariant } from '@/components/Section';
import SlotSelect from '@/components/SlotSelect';

interface TypeAndColorSectionProps {
  type: string | null;
  name: string;
  color: string;
  saveColor: (color: string) => void;
  onChangeType: (type: string) => void;
  colorPopperModifiers?: StrictPopperModifiers;
}

const { ColorScheme, BASE_COLORS, DEFAULT_SCHEME_COLORS } = COLOR_PICKER_CONSTANTS;

const TypeAndColorSection: React.FC<TypeAndColorSectionProps> = ({
  name,
  type,
  color,
  saveColor,
  onChangeType,
  colorPopperModifiers = [{ name: 'offset', options: { offset: [-20, -21] } }],
}) => {
  const popperContainerRef = React.useRef<HTMLDivElement>(null);
  const [isShowingPicker, togglePopper] = useDismissable(false, { ref: popperContainerRef });

  const baseOrSchemeColor = React.useMemo(() => isBaseOrSchemeColor(color), [color]);

  return (
    <Section
      header="Type"
      dividers={false}
      variant={SectionVariant.QUATERNARY}
      backgroundColor="#fdfdfd"
      customHeaderStyling={{ paddingTop: '16px' }}
      customContentStyling={{ paddingBottom: '24px' }}
    >
      <Box.FlexApart>
        <Box.Flex flex={2} mr={24}>
          <SlotSelect value={type} onChange={onChangeType} />
        </Box.Flex>

        <Box.Flex>
          <ColorThemes small colors={[DEFAULT_SCHEME_COLORS[ColorScheme.DARK], ...BASE_COLORS]} selectedColor={color} onColorSelect={saveColor} />

          <ColorThemeUnit
            small
            onClick={() => togglePopper()}
            selected={!baseOrSchemeColor}
            background={!baseOrSchemeColor ? color : COLOR_PICKER_CONSTANTS.COLOR_WHEEL}
            disableContextMenu
          />

          {isShowingPicker && (
            <ColorPickerPopper
              tagName={name}
              onChange={saveColor}
              modifiers={colorPopperModifiers}
              selectedColor={color}
              popperContainerRef={popperContainerRef}
            />
          )}
        </Box.Flex>
      </Box.FlexApart>
    </Section>
  );
};

export default TypeAndColorSection;
