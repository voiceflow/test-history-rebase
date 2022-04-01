import { Box, FlexCenter, Input, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalBody } from '@/components/Modal';
import { ModalType } from '@/constants';
import * as VariableState from '@/ducks/variableState';
import { useDispatch, useHotKeys, useModals, useSelector, useTrackingEvents } from '@/hooks';
import { Hotkey } from '@/keymap';

const VariableStatesManagerModal: React.FC = () => {
  const { open: openEditorModal, isOpened: isEditorModalOpened } = useModals(ModalType.VARIABLE_STATE_EDITOR_MODAL);
  const { close } = useModals(ModalType.VARIABLE_STATES_MANAGER_MODAL);
  const variableStates = useSelector(VariableState.allVariableStatesSelector);
  const updateVariableState = useDispatch(VariableState.updateState);
  const deleteVariableState = useDispatch(VariableState.deleteState);
  const [variableStateNames, setVariableStateNames] = React.useState({} as Record<string, string>);
  const [trackingEvents] = useTrackingEvents();

  const handleVariableNameChange = async (variableStateID: string) => {
    const name = variableStateNames[variableStateID];
    if (!name) return;
    await updateVariableState(variableStateID, { name });
  };

  const handleVariableStateDelete = async (variableStateID: string) => {
    await deleteVariableState(variableStateID);
    trackingEvents.trackVariableStateDeleted();
  };

  const handleEditState = (variableStateID: string) => {
    openEditorModal({ variableStateID });
  };

  const handleInputTextChange = (variableStateID: string, newName: string) => {
    setVariableStateNames({ ...variableStateNames, [variableStateID]: newName });
  };

  React.useEffect(() => {
    if (variableStates.length === 0) {
      close();
    }
  }, [variableStates]);

  React.useEffect(
    () => setVariableStateNames(variableStates.reduce((acc, variableState) => ({ ...acc, [variableState.id]: variableState.name }), {})),
    [variableStates]
  );

  useHotKeys(Hotkey.CLOSE_VARIABLE_STATE_MANAGER_MODAL, close, { preventDefault: true, disable: isEditorModalOpened }, [close]);

  return (
    <Modal id={ModalType.VARIABLE_STATES_MANAGER_MODAL} title="Manage States">
      <ModalBody>
        {Object.keys(variableStateNames).map((variableStateID, idx) => (
          <FlexCenter style={{ marginTop: idx > 0 ? '16px' : '0px' }} key={variableStateID}>
            <Input
              value={variableStateNames[variableStateID]}
              onChangeText={(newValue: string) => handleInputTextChange(variableStateID, newValue)}
              onBlur={() => handleVariableNameChange(variableStateID)}
            />
            <Box mr="16px" ml="24px">
              <TippyTooltip html={<div>Edit state</div>}>
                <SvgIcon icon="editName" size={16} color="#6e849a" clickable enableOpacity onClick={() => handleEditState(variableStateID)} />
              </TippyTooltip>
            </Box>
            <Box>
              <TippyTooltip html={<div>Delete</div>}>
                <SvgIcon
                  icon="activeDelete"
                  size={16}
                  color="#6e849a"
                  clickable
                  enableOpacity
                  onClick={() => handleVariableStateDelete(variableStateID)}
                />
              </TippyTooltip>
            </Box>
          </FlexCenter>
        ))}
      </ModalBody>
    </Modal>
  );
};

export default VariableStatesManagerModal;
