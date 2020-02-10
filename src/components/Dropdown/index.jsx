import React, { Fragment, useRef, useState } from 'react';
import { Manager, Popper, Reference } from 'react-popper';
import styled from 'styled-components';

import Menu from '@/components/Menu';
import Portal from '@/components/Portal';
import { useDismissable } from '@/hooks/dismiss';

const DEFAULT_PORTAL_NODE = document.body;
const PopoverContainer = styled.div`
  z-index: 1051;
  z-index: 1100;
  /* to override default width css from react-popper */
  width: ${({ autoWidth }) => !autoWidth && 'auto !important'};

  ${({ noScroll }) =>
    noScroll
      ? `ul {
    padding: 0;
    max-height: none !important;
    * {
      max-height: none !important;
    }
  }`
      : ''}
`;

function Dropdown({
  options,
  noScroll,
  onSelect,
  onClose,
  placement = 'bottom-start',
  children,
  menu,
  autoWidth = false,
  selfDismiss = false,
  portal = DEFAULT_PORTAL_NODE,
}) {
  const containerRef = useRef(null);

  const [isOpen, onToggle] = useDismissable(false, onClose, false, selfDismiss && containerRef);
  const [childRef, setRef] = useState(null);

  function onComputedStyle(data) {
    if (placement === 'bottom-start') {
      data.styles.width = childRef && childRef.getBoundingClientRect().width;
    }
    return data;
  }

  const Wrapper = portal ? Portal : Fragment;
  const wrapperProps = portal ? { portalNode: portal } : {};

  return (
    <Manager>
      <Reference innerRef={(node) => setRef(node)}>{({ ref }) => children(ref, onToggle, isOpen)}</Reference>
      {isOpen && (
        <Wrapper {...wrapperProps}>
          <Popper
            placement={placement}
            modifiers={{
              autoSizing: { enabled: true, fn: onComputedStyle, order: 840 },
              preventOverflow: { enabled: false },
              hide: { enabled: false },
            }}
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
                noScroll={noScroll}
              >
                {(typeof menu === 'function' ? menu(onToggle) : menu) ||
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
        </Wrapper>
      )}
    </Manager>
  );
}

export default Dropdown;
