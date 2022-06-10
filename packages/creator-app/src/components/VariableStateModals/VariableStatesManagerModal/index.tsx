import { Dropdown, IconButton, IconButtonVariant, toast } from '@voiceflow/ui';
import React from 'react';

import { ModalType } from '@/constants';
import * as VariableState from '@/ducks/variableState';
import { useDispatch, useHotKeys, useModals, useSelector, useTrackingEvents } from '@/hooks';
import { Hotkey } from '@/keymap';

import VariableStatesModal from '../VariableStatesModal';

const VariableStatesManagerModal: React.FC = () => {
  const { isOpened: isEditorModalOpened, data } = useModals<{ variableStateID?: string }>(ModalType.VARIABLE_STATES_MANAGER_MODAL);
  const { close } = useModals(ModalType.VARIABLE_STATES_MANAGER_MODAL);
  const variableStates = useSelector(VariableState.allVariableStatesSelector);
  const deleteVariableState = useDispatch(VariableState.deleteState);

  const [trackingEvents] = useTrackingEvents();

  React.useEffect(() => {
    if (variableStates.length === 0) {
      close?.();
    }
  }, [variableStates]);

  const handleVariableStateDelete = async (variableStateID: string) => {
    await deleteVariableState(variableStateID);
    toast.success('Variable state deleted');
    trackingEvents.trackVariableStateDeleted();
    close?.();
  };

  useHotKeys(Hotkey.CLOSE_VARIABLE_STATE_MANAGER_MODAL, close, { preventDefault: true, disable: isEditorModalOpened }, [close]);

  return (
    <VariableStatesModal
      modalType={ModalType.VARIABLE_STATES_MANAGER_MODAL}
      saveText="Save Persona"
      title="Edit Persona"
      headerActions={
        <Dropdown
          options={[
            {
              key: 'delete',
              label: 'Delete persona',
              onClick: () => {
                if (!data.variableStateID) return;
                handleVariableStateDelete(data.variableStateID);
              },
            },
          ]}
        >
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
  );
};

export default VariableStatesManagerModal;
