import React, { useRef, useState } from 'react';
import { Manager, Popper, Reference } from 'react-popper';
import styled from 'styled-components';

import Menu from '@/componentsV2/Menu';
import { useDismissable } from '@/hooks/dismiss';

const PopoverContainer = styled.div`
  z-index: 50;
  /* to override default width css from react-popper */
  width: ${({ autoWidth }) => !autoWidth && 'auto !important'};
`;

function Dropdown({ options, onSelect, onClose, placement = 'bottom-start', children, menu, autoWidth = false, selfDismiss = false }) {
  const containerRef = useRef(null);

  const [isOpen, onToggle] = useDismissable(false, onClose, false, selfDismiss && containerRef);
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
            <PopoverContainer
              ref={(container) => {
                ref(container);
                containerRef.current = container;
              }}
              style={style}
              data-placement={placement}
              autoWidth={autoWidth}
            >
              {(typeof menu === 'function' ? menu() : menu) ||
                (options && (
                  <Menu
                    options={options}
                    onSelect={(value) => {
                      onSelect && onSelect(value);
                    }}
                  />
                ))}
            </PopoverContainer>
          )}
        </Popper>
      )}
    </Manager>
  );
}

export default Dropdown;
