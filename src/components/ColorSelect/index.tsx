import React from 'react';
import { Manager, Popper, Reference } from 'react-popper';

import ColorPicker from '@/components/ColorPicker';
import Portal from '@/components/Portal';
import { useDismissable } from '@/hooks/dismiss';

import { ColorPreview } from './components';

export type ColorSelectProps = React.ComponentProps<typeof ColorPicker> & {
  onShow?: () => void;
  onClose?: () => void;
};

const ColorSelect: React.FC<ColorSelectProps> = ({ color, onChange, onClose, onShow }) => {
  const popperRef = React.useRef<HTMLElement | null>(null);

  const [open, toggleOpen] = useDismissable(false, onClose, false, popperRef);

  const onOpen = () => {
    if (!open) {
      onShow?.();
    }

    toggleOpen();
  };

  return (
    <Manager>
      <Reference>
        {({ ref }) => <ColorPreview ref={ref} style={{ color: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})` }} onClick={onOpen} />}
      </Reference>

      {open && (
        <Portal portalNode={document.body}>
          <Popper
            innerRef={popperRef}
            placement="bottom-start"
            modifiers={[
              { name: 'offset', options: { offset: [0, 5] } },
              { name: 'preventOverflow', options: { boundary: document.body } },
            ]}
          >
            {({ ref, style }) => (
              <div ref={ref} style={style}>
                <ColorPicker color={color} onChange={onChange} />
              </div>
            )}
          </Popper>
        </Portal>
      )}
    </Manager>
  );
};

export default ColorSelect;
