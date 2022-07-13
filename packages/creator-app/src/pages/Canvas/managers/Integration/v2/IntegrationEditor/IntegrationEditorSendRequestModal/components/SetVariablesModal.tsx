import { Button, ButtonVariant, Input } from '@voiceflow/ui';
import React from 'react';

import Modal from '@/components/Modal';
import { ModalType } from '@/constants';

import { InputAction, VariableListContainer } from '../styles';

interface SetVariablesModalProps {
  variableValues: Record<string, string>;
  onChange: (variableName: string, value: string) => void;
  onCancel: () => void;
  onSendRequest: () => void;
  isLoading: boolean;
}

const SetVariablesModal: React.FC<SetVariablesModalProps> = ({ variableValues, onChange, onCancel, onSendRequest, isLoading }) => {
  return (
    <Modal id={ModalType.INTEGRATION_EDITOR_SEND_REQUEST_MODAL} title="Set Variables">
      <Modal.Body>
        <VariableListContainer>
          {Object.keys(variableValues).map((variable, index) => (
            <Input
              key={index}
              value={variableValues[variable] || ''}
              leftAction={<InputAction>{variable.toUpperCase()}</InputAction>}
              placeholder="Enter value"
              onChangeText={(value) => onChange(variable, value)}
            />
          ))}
        </VariableListContainer>
      </Modal.Body>

      <Modal.Footer>
        <Button variant={ButtonVariant.TERTIARY} squareRadius style={{ marginRight: '12px' }} onClick={onCancel}>
          Cancel
        </Button>

        <Button squareRadius onClick={onSendRequest} isLoading={isLoading}>
          Send Request
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SetVariablesModal;
