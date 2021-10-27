import React from 'react';

import ColorPicker from '@/components/ColorPicker';
import Popper from '@/components/Popper';
import { chainVoid } from '@/utils/functional';

import { ColorPreview } from './components';

export type ColorSelectProps = React.ComponentProps<typeof ColorPicker> & {
  disabled?: boolean;
  onShow?: () => void;
  onClose?: () => void;
  onPickerPreviewMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onPickerContainerMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void;
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
        onClick={disabled ? undefined : chainVoid(onToggle, () => !isOpened && onShow?.())}
        disabled={disabled}
        onMouseDown={onPickerPreviewMouseDown}
      />
    )}
  </Popper>
);

export default ColorSelect;
