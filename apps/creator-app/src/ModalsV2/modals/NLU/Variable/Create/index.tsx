import { Button, Input, Modal } from '@voiceflow/ui';
import React from 'react';

import { CanvasCreationType } from '@/ducks/tracking';
import manager from '@/ModalsV2/manager';

import { useCreateVariables } from './hooks';

export interface NLUVariableCreateProps {
  name?: string;
  single?: boolean;
  creationType?: CanvasCreationType;
}

const Create = manager.create<NLUVariableCreateProps, string[]>(
  'NLUVariableCreate',
  () =>
    ({ api, type, name = '', opened, hidden, single, animated, creationType, closePrevented }) => {
      const [variableText, setVariableText] = React.useState(name);

      const { isCreating, onCreateSingle, onCreateMultiple } = useCreateVariables({ creationType });

      const onCreate = async () => {
        if (!variableText.trim()) return;

        try {
          api.preventClose();

          const variables = await (single ? onCreateSingle(variableText) : onCreateMultiple(variableText));

          api.resolve(variables);
          api.enableClose();
          api.close();
        } catch {
          api.enableClose();
        }
      };

      return (
        <Modal type={type} maxWidth={450} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
          <Modal.Header border actions={<Modal.Header.CloseButtonAction onClick={() => api.close()} />}>
            Create Variable
          </Modal.Header>

          <Modal.Body mt={24}>
            <Input
              value={variableText}
              autoFocus
              placeholder={single ? 'Enter variable name' : 'variable 1, variable 2, variable 3...'}
              onEnterPress={onCreate}
              onChangeText={setVariableText}
            />
          </Modal.Body>

          <Modal.Footer gap={12}>
            <Button variant={Button.Variant.TERTIARY} onClick={api.close} squareRadius>
              Cancel
            </Button>

            <Button
              type="submit"
              name="submit"
              onClick={onCreate}
              minWidth={92}
              disabled={!variableText.trim() || closePrevented}
              isLoading={isCreating}
            >
              Create Variable
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
);

export default Create;
