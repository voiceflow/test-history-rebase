import React from 'react';
import { Manager, Popper, Reference } from 'react-popper';

import Menu from '@/componentsV2/Menu';
import { useEnableDisable } from '@/hooks/toggle';

function DropwdownMenu({ options, onSelect, placement = 'bottom-start', children }) {
  const [isOpen, setOpen, setClose] = useEnableDisable();

  function onClose() {
    document.removeEventListener('click', onClose);
    setClose();
  }

  const onToggle = isOpen
    ? onClose
    : () => {
        document.addEventListener('click', onClose);
        setOpen();
      };

  return (
    <Manager>
      <Reference>{({ ref }) => children(ref, onToggle)}</Reference>
      {isOpen && (
        <Popper placement={placement}>
          {({ ref, style, placement }) => (
            <div ref={ref} style={style} data-placement={placement}>
              <Menu
                options={options}
                onSelect={(value) => {
                  onClose();
                  onSelect(value);
                }}
              />
            </div>
          )}
        </Popper>
      )}
    </Manager>
  );
}

export default DropwdownMenu;
