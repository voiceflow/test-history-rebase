import { COLOR_PICKER_CONSTANTS, ColorThemeUnit, SectionV2, SidebarEditor, SidebarEditorTypes } from '@voiceflow/ui';
import React from 'react';
import { useDismissable } from 'react-dismissable-layers';

import { ColorPickerPopper } from '@/components/ColorPickerPopper';

import { useEditor } from '../hooks';

interface ChipHeaderProps extends Partial<Omit<SidebarEditorTypes.HeaderProps, 'title'>> {
  color?: string;
  title?: string;
  colorScheme?: COLOR_PICKER_CONSTANTS.ColorScheme;
  onChangeColor: (color: string) => void;
}

const ChipHeader: React.FC<ChipHeaderProps> = ({ title, color, colorScheme = COLOR_PICKER_CONSTANTS.ColorScheme.DARK, onChangeColor }) => {
  const editor = useEditor();
  const popperContainerRef = React.useRef<HTMLDivElement>(null);
  const [isShowingPicker, togglePopper] = useDismissable(false, { ref: popperContainerRef });

  const chipColor = color || COLOR_PICKER_CONSTANTS.DEFAULT_SCHEME_COLORS[colorScheme].standardColor;

  return (
    <SidebarEditor.Header>
      <SidebarEditor.HeaderTitle>{title ?? editor.label}</SidebarEditor.HeaderTitle>

      <SectionV2.ActionsContainer>
        <ColorThemeUnit small onClick={() => togglePopper()} background={chipColor} disableContextMenu />

        {isShowingPicker && (
          <ColorPickerPopper
            onChange={onChangeColor}
            placement="bottom-end"
            modifiers={[{ name: 'offset', options: { offset: [0, 15] } }]}
            selectedColor={chipColor}
            defaultColorScheme={colorScheme}
            popperContainerRef={popperContainerRef}
          />
        )}
      </SectionV2.ActionsContainer>
    </SidebarEditor.Header>
  );
};

export default ChipHeader;
