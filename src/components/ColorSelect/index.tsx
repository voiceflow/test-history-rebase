import React from 'react';
import { Manager, Popper, Reference } from 'react-popper';

import ColorPicker from '@/components/ColorPicker';
import Portal from '@/components/Portal';
import { useDismissable } from '@/hooks';

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
  const popperRef = React.useRef<HTMLElement>(null);

  const [open, toggleOpen] = useDismissable(false, { onClose, autoDismiss: true, ref: popperRef, dismissEvent: 'mousedown' });

  const onOpen = () => {
    if (!disabled) {
      if (!open) {
        onShow?.();
      }

      toggleOpen();
    }
  };

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <ColorPreview
            ref={ref}
            style={{
              color: `rgba(${colorPickerProps.color.r}, ${colorPickerProps.color.g}, ${colorPickerProps.color.b}, ${colorPickerProps.color.a})`,
            }}
            disabled={disabled}
            onClick={onOpen}
            onMouseDown={onPickerPreviewMouseDown}
          />
        )}
      </Reference>

      {open && (
        <Portal portalNode={document.body}>
          <Popper
            innerRef={(node) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              popperRef.current = node;
            }}
            placement="bottom-start"
            modifiers={{ offset: { offset: '0,5' }, preventOverflow: { boundariesElement: document.body } }}
          >
            {({ ref, style }) => (
              <div ref={ref} style={style} onMouseDown={onPickerContainerMouseDown}>
                <ColorPicker {...colorPickerProps} />
              </div>
            )}
          </Popper>
        </Portal>
      )}
    </Manager>
  );
};

export default ColorSelect;
