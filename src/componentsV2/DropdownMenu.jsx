import React, { useState } from 'react';
import { Manager, Popper, Reference } from 'react-popper';
import styled from 'styled-components';

import Menu from '@/componentsV2/Menu';
import { useEnableDisable } from '@/hooks/toggle';

const MenuContainer = styled.div`
  z-index: 10;
`;

function DropwdownMenu({ options, onSelect, placement = 'bottom-start', children }) {
  const [isOpen, setOpen, setClose] = useEnableDisable();
  const [childRef, setRef] = useState(null);

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

  function onComputedStyle(data) {
    if (placement === 'bottom-start') {
      data.styles.width = childRef && childRef.getBoundingClientRect().width;
    }
    return data;
  }

  return (
    <Manager>
      <Reference innerRef={(node) => setRef(node)}>
        {({ ref }) => {
          return children(ref, onToggle, isOpen);
        }}
      </Reference>
      {isOpen && (
        <Popper placement={placement} modifiers={{ autoSizing: { enabled: true, fn: onComputedStyle, order: 840 } }}>
          {({ ref, style, placement }) => {
            return (
              <MenuContainer ref={ref} style={style} data-placement={placement}>
                <Menu
                  options={options}
                  onSelect={(value) => {
                    onClose();
                    onSelect(value);
                  }}
                />
              </MenuContainer>
            );
          }}
        </Popper>
      )}
    </Manager>
  );
}

export default DropwdownMenu;
