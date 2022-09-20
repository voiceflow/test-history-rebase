import { Dropdown, IconButton, IconButtonVariant, Modal, toast } from '@voiceflow/ui';
import React from 'react';

import * as VariableState from '@/ducks/variableState';
import { useDispatch, useHotKeys, useSelector, useTrackingEvents } from '@/hooks';
import { Hotkey } from '@/keymap';

import manager from '../../manager';
import { VariableStateForm } from './components';

interface Props {
  variableStateID?: string;
}

const Manage = manager.create<Props>('VariableStateManage', () => ({ api, type, opened, hidden, animated, variableStateID }) => {
  const variableStates = useSelector(VariableState.allVariableStatesSelector);
  const deleteVariableState = useDispatch(VariableState.deleteState);

  const [trackingEvents] = useTrackingEvents();

  const handleVariableStateDelete = async (variableStateID: string) => {
    await deleteVariableState(variableStateID);
    toast.success('Variable state deleted');
    trackingEvents.trackVariableStateDeleted();
    api.close?.();
  };

  const onDelete = () => {
    if (!variableStateID) return;
    handleVariableStateDelete(variableStateID);
  };

  const options = [{ key: 'delete', label: 'Delete persona', onClick: onDelete }];

  useHotKeys(Hotkey.MODAL_CLOSE, api.close, { preventDefault: true }, [api.close]);

  React.useEffect(() => {
    if (variableStates.length === 0) {
      api.close?.();
    }
  }, [variableStates]);

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={450}>
      <VariableStateForm
        saveText="Save Persona"
        title="Edit Persona"
        close={api.close}
        variableStateID={variableStateID}
        headerActions={
          <Dropdown options={options}>
            {(ref, onToggle, isOpened) => (
              <IconButton
                style={{ marginRight: '0px' }}
                size={14}
                icon="ellipsis"
                variant={IconButtonVariant.BASIC}
                onClick={onToggle}
                activeClick={isOpened}
                ref={ref}
              />
            )}
          </Dropdown>
        }
      />
    </Modal>
  );
});

export default Manage;
