import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Manager, Popper, Reference } from 'react-popper';
import styled from 'styled-components';

import Menu from '@/componentsV2/Menu';
import { useDismissable } from '@/hooks/dismiss';

const MenuContainer = styled.div`
  z-index: 10;
  /* to override default width css from react-popper */
  width: ${({ autoWidth }) => autoWidth && 'auto !important'};
`;

function DropwdownMenu({ options, onSelect, onClose, placement, autoWidth, multiSelectProps: { multiSelect, ...restMultiSelectProps }, children }) {
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
        <Popper placement={placement} modifiers={{ autoSizing: { enabled: true, fn: onComputedStyle, order: 840 } }}>
          {({ ref, style, placement }) => (
            <MenuContainer autoWidth={autoWidth} ref={ref} style={style} data-placement={placement}>
              <Menu
                options={options}
                onSelect={(value) => {
                  if (!multiSelect) {
                    onToggle();
                  }
                  onSelect && onSelect(value);
                }}
                multiSelect={multiSelect}
                {...restMultiSelectProps}
              />
            </MenuContainer>
          )}
        </Popper>
      )}
    </Manager>
  );
}

DropwdownMenu.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object),
  onSelect: PropTypes.func,
  onClose: PropTypes.func,
  placement: PropTypes.string,
  multiSelectProps: PropTypes.object,
  children: PropTypes.elementType,
};

DropwdownMenu.defaultProps = {
  placement: 'bottom-start',
  multiSelectProps: {
    noAutoClose: false,
    multiSelect: false,
  },
};

export default DropwdownMenu;
