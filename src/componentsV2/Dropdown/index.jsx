import React, { useState } from 'react';
import { Manager, Popper, Reference } from 'react-popper';
import styled from 'styled-components';

import Menu from '@/componentsV2/Menu';
import { useDismissable } from '@/hooks/dismiss';

const MenuContainer = styled.div`
  z-index: 50;
  /* to override default width css from react-popper */
  width: ${({ autoWidth }) => !autoWidth && 'auto !important'};
`;

function Dropdown({ options, onSelect, onClose, placement = 'bottom-start', children, menu, autoWidth = false }) {
  const [isOpen, onToggle] = useDismissable(false, onClose);
  const [childRef, setRef] = useState(null);

  function onComputedStyle(data) {
    if (placement === 'bottom-start') {
      data.styles.width = childRef && childRef.getBoundingClientRect().width;
    }
    return data;
  }

  return (
    <Manager>
      <Reference innerRef={(node) => setRef(node)}>{({ ref }) => children(ref, onToggle, isOpen)}</Reference>
      {isOpen && (
        <Popper
          placement={placement}
          modifiers={{ autoSizing: { enabled: true, fn: onComputedStyle, order: 840 }, preventOverflow: { enabled: false } }}
        >
          {({ ref, style, placement }) => (
            <MenuContainer ref={ref} style={style} data-placement={placement} autoWidth={autoWidth}>
              {menu ||
                (options && (
                  <Menu
                    options={options}
                    onSelect={(value) => {
                      onSelect && onSelect(value);
                    }}
                  />
                ))}
            </MenuContainer>
          )}
        </Popper>
      )}
    </Manager>
  );
}

export default Dropdown;
