import { Button, ButtonVariant, Input } from '@voiceflow/ui';
import React from 'react';

import Modal from '@/components/Modal';
import { ModalType } from '@/constants';

import * as S from './styles';

interface SetVariablesModalProps {
  onCancel: VoidFunction;
  onChange: (variableName: string, value: string) => void;
  isLoading: boolean;
  onSendRequest: VoidFunction;
  variableValues: Record<string, string>;
}

const SetVariablesModal: React.FC<SetVariablesModalProps> = ({ variableValues, onChange, onCancel, onSendRequest, isLoading }) => (
  <Modal id={ModalType.INTEGRATION_EDITOR_SEND_REQUEST_MODAL} title="Set Variables">
    <Modal.Body>
      <S.VariableListContainer>
        {Object.keys(variableValues).map((variable, index) => (
          <Input
            key={index}
            value={variableValues[variable] || ''}
            leftAction={<S.InputAction>{variable.toUpperCase()}</S.InputAction>}
            placeholder="Enter value"
            onChangeText={(value) => onChange(variable, value)}
          />
        ))}
      </S.VariableListContainer>
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

export default SetVariablesModal;
