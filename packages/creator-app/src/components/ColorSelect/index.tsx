import { Portal, useCachedValue, usePopper } from '@voiceflow/ui';
import React from 'react';
import { useDismissable } from 'react-dismissable-layers';

import ColorPicker from '@/components/ColorPicker';

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
}) => {
  const popper = usePopper({
    placement: 'bottom-start',
    modifiers: [
      { name: 'offset', options: { offset: [0, 5] } },
      { name: 'preventOverflow', options: { boundary: document.body } },
    ],
  });

  const dismissableRef = useCachedValue(popper.popperElement as Element);
  const [open, toggleOpen] = useDismissable(false, {
    onClose,
    ref: dismissableRef,
    dismissEvent: 'mousedown',
  });

  const onOpen = () => {
    if (!disabled) {
      if (!open) {
        onShow?.();
      }

      toggleOpen();
    }
  };

  return (
    <>
      <ColorPreview
        ref={popper.setReferenceElement}
        style={{
          color: `rgba(${colorPickerProps.color.r}, ${colorPickerProps.color.g}, ${colorPickerProps.color.b}, ${colorPickerProps.color.a})`,
        }}
        disabled={disabled}
        onClick={onOpen}
        onMouseDown={onPickerPreviewMouseDown}
      />
      {open && (
        <Portal portalNode={document.body}>
          <div ref={popper.setPopperElement} style={popper.styles.popper} onMouseDown={onPickerContainerMouseDown} {...popper.attributes.popper}>
            <ColorPicker {...colorPickerProps} />
          </div>
        </Portal>
      )}
    </>
  );
};

export default ColorSelect;
