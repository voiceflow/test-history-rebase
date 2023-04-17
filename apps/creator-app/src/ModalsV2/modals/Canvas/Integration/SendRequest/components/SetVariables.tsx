import { Button, ButtonVariant, Input, Modal } from '@voiceflow/ui';
import React from 'react';

import * as S from '../styles';

interface Props {
  variableValues: Record<string, string>;
  updateVariableValue: (key: string, value: string) => void;
  sendRequest: () => Promise<void>;
  isLoading: boolean;
  close: VoidFunction;
}

const SetVariables: React.FC<Props> = ({ variableValues, updateVariableValue, sendRequest, isLoading, close }) => (
  <>
    <Modal.Header>Set Variables</Modal.Header>
    <Modal.Body>
      <S.VariableListContainer>
        {Object.keys(variableValues).map((variable, index) => (
          <Input
            key={index}
            value={variableValues[variable] || ''}
            leftAction={<S.InputAction>{variable.toUpperCase()}</S.InputAction>}
            placeholder="Enter value"
            onChangeText={(value: string) => updateVariableValue(variable, value)}
          />
        ))}
      </S.VariableListContainer>
    </Modal.Body>

    <Modal.Footer>
      <Button variant={ButtonVariant.TERTIARY} squareRadius style={{ marginRight: '12px' }} onClick={close}>
        Cancel
      </Button>

      <Button squareRadius onClick={sendRequest} isLoading={isLoading}>
        Send Request
      </Button>
    </Modal.Footer>
  </>
);

export default SetVariables;
