import PropTypes from 'prop-types';
import React from 'react';
import { Manager, Popper, Reference } from 'react-popper';

import { useDismissable } from '@/hooks';

import Portal from './component/Portal';

function InfoPopUp({ portal = true, placement = 'bottom-end', children, onClose, reference }) {
  const [isOpen, onToggle] = useDismissable(false, onClose);

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <span onClick={onToggle} ref={ref}>
            {reference(isOpen)}
          </span>
        )}
      </Reference>
      {isOpen && (
        <Portal isActive={portal}>
          <Popper
            placement={placement}
            modifiers={{
              hide: { enabled: false },
              preventOverflow: { enabled: false },
            }}
          >
            {({ ref, style, placement }) => (
              <div ref={ref} style={style} data-placement={placement}>
                {children}
              </div>
            )}
          </Popper>
        </Portal>
      )}
    </Manager>
  );
}

InfoPopUp.propTypes = {
  portal: PropTypes.bool,
  label: PropTypes.any,
  placement: PropTypes.string,
  reference: PropTypes.any,
};

export default InfoPopUp;
