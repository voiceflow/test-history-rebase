import { Box, Button, FlexCenter, Input, Link, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import * as VariableState from '@/ducks/variableState';
import { useModals, useSelector } from '@/hooks';

const VariableStatesManagerModal: React.FC = () => {
  const { close: closeModal } = useModals(ModalType.VARIABLE_STATES_MANAGER_MODAL);
  const variableStates = useSelector(VariableState.allVariableStatesSelector);

  const handleSave = () => closeModal();

  return (
    <Modal id={ModalType.VARIABLE_STATES_MANAGER_MODAL} title="Manage States">
      <ModalBody>
        {variableStates.map((variableState, idx) => (
          <FlexCenter style={{ marginTop: idx > 0 ? '16px' : '0px' }} key={variableState.id}>
            <Input value={variableState.name} onChangeText={() => {}} onEnterPress={() => {}} />
            <Box mr="16px" ml="24px">
              <SvgIcon icon="editName" size={16} color="#6e849a" clickable style={{ opacity: 0.8 }} />
            </Box>
            <Box>
              <TippyTooltip html={<div>test</div>}>
                <SvgIcon icon="activeDelete" size={16} color="#6e849a" clickable style={{ opacity: 0.8 }} />
              </TippyTooltip>
            </Box>
          </FlexCenter>
        ))}
      </ModalBody>

      <ModalFooter>
        <Link onClick={() => closeModal()} style={{ marginRight: '33px', fontWeight: 600 }}>
          Cancel
        </Link>

        <Button onClick={handleSave}>Save</Button>
      </ModalFooter>
    </Modal>
  );
};

export default VariableStatesManagerModal;
