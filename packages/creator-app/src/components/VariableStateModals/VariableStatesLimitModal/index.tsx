import { PlanType } from '@voiceflow/internal';
import { Box, Button, ButtonVariant, Flex, SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useModals, useSelector } from '@/hooks';

import { getPlanLimitDetails } from './utils';

const VariableStatesLimitModal: React.FC = () => {
  const { close } = useModals<{ planType: PlanType }>(ModalType.VARIABLE_STATES_LIMIT_MODAL);
  const plan = useSelector(WorkspaceV2.active.planSelector);
  const { open: openPaymentModal } = useModals<{ planType: PlanType }>(ModalType.PAYMENT);
  const PlanLimitDetails = plan && getPlanLimitDetails(plan);

  const handleSubmit = () => {
    PlanLimitDetails?.onSubmit({ openPaymentModal });
  };

  if (!PlanLimitDetails) return null;

  return (
    <Modal id={ModalType.VARIABLE_STATES_LIMIT_MODAL} title="Variable States" maxWidth={392}>
      <ModalBody>
        <Flex style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <Box mb="16px" mt="24px">
            <SvgIcon icon="skillTemplate" size={80} />
          </Box>
          <Text fontWeight={600}>{PlanLimitDetails.title}</Text>
          <Box mt="16px" mb="17px">
            <Text color="#62778c">{PlanLimitDetails.description}</Text>
          </Box>
        </Flex>
      </ModalBody>
      <ModalFooter>
        <Box mr="12px">
          <Button variant={ButtonVariant.TERTIARY} squareRadius onClick={close}>
            Cancel
          </Button>
        </Box>
        <Button variant={ButtonVariant.PRIMARY} squareRadius onClick={handleSubmit}>
          {PlanLimitDetails.submitText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default VariableStatesLimitModal;
