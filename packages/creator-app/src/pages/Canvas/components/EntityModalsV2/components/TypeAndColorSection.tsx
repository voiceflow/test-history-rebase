import { Box, COLOR_PICKER_CONSTANTS, ColorThemes, ColorThemeUnit, isBaseOrSchemeColor, SectionV2, StrictPopperModifiers } from '@voiceflow/ui';
import React from 'react';
import { useDismissable } from 'react-dismissable-layers';

import { ColorPickerPopper } from '@/components/ColorPickerPopper';
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
    <SectionV2.SimpleContentSection
      isAccent
      headerProps={{ bottomUnit: 1.5, topUnit: 2.5 }}
      contentProps={{ bottomOffset: 3 }}
      header={
        <SectionV2.Title bold secondary minHeight="22px">
          Type
        </SectionV2.Title>
      }
    >
      <Box.FlexApart gap={24}>
        <Box.Flex flex={2}>
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
    </SectionV2.SimpleContentSection>
  );
};

export default TypeAndColorSection;
