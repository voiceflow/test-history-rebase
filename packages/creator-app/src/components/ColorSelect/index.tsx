import { Utils } from '@voiceflow/common';
import { Popper } from '@voiceflow/ui';
import React from 'react';

import ColorPicker from '@/components/ColorPicker';

import { ColorPreview } from './components';

export type ColorSelectProps = React.ComponentProps<typeof ColorPicker> & {
  onShow?: () => void;
  onClose?: () => void;
  disabled?: boolean;
  onPickerPreviewMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onPickerContainerMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void;
  children?: unknown;
};

const ColorSelect: React.FC<ColorSelectProps> = ({
  disabled,
  onShow,
  onClose,
  children: _,
  onPickerPreviewMouseDown,
  onPickerContainerMouseDown,
  ...colorPickerProps
}) => (
  <Popper onClose={onClose} renderContent={() => <ColorPicker {...colorPickerProps} />}>
    {({ ref, onToggle, isOpened }) => (
      <ColorPreview
        ref={ref}
        style={{
          color: `rgba(${colorPickerProps.color.r}, ${colorPickerProps.color.g}, ${colorPickerProps.color.b}, ${colorPickerProps.color.a})`,
        }}
        onClick={disabled ? undefined : Utils.functional.chainVoid(onToggle, () => !isOpened && onShow?.())}
        disabled={disabled}
        onMouseDown={onPickerPreviewMouseDown}
      />
    )}
  </Popper>
);

export default ColorSelect;
