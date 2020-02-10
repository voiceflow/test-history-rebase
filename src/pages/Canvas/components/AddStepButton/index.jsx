import React, { useContext } from 'react';
import { Manager, Popper, Reference } from 'react-popper';

import Menu from '@/componentsV2/Menu';
import Portal from '@/componentsV2/Portal';
import { useDismissable } from '@/hooks';
import AddButton from '@/pages/Canvas/components/AddButton';
import { MergeStatusContext } from '@/pages/Canvas/components/MergeOverlay/contexts';
import { compose } from '@/utils/functional';

function AddStepButton({ onAdd, options }) {
  const mergeStatus = useContext(MergeStatusContext);

  const [isOpen, onToggle, onClose] = useDismissable(false, null, true);

  if (mergeStatus !== null) {
    return null;
  }

  return (
    <AddButton onClick={onToggle} tooltip="Add Step" disableTooltip={isOpen}>
      <Manager>
        <Reference>{({ ref }) => <div ref={ref} />}</Reference>

        {isOpen && (
          <Portal>
            <Popper placement="bottom" positionFixed eventsEnabled>
              {({ ref, style, placement }) => (
                <div ref={ref} style={{ ...style, zIndex: 50 }} data-placement={placement}>
                  <Menu
                    searchable
                    options={options}
                    onSelect={compose(
                      onClose,
                      onAdd
                    )}
                  />
                </div>
              )}
            </Popper>
          </Portal>
        )}
      </Manager>
    </AddButton>
  );
}

export default AddStepButton;
