import { SLOT_REGEXP, Utils } from '@voiceflow/common';
import { Box, Button, Modal, useSessionStorageState } from '@voiceflow/ui';
import React from 'react';

import VariableInput from '@/components/VariableInput';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import { deepVariableReplacement, deepVariableSearch } from '@/ModalsV2/modals/Canvas/Integration/SendRequest/utils';

import { useModal } from '../../hooks/modal';
import manager from '../../manager';

export interface Props {
  variablesToFill: string[];
}

const VariablePrompt = manager.create<Props, Record<string, string>>(
  'VariablePrompt',
  () =>
    ({ api, type, opened, hidden, animated, variablesToFill }) => {
      const projectID = useSelector(Session.activeProjectIDSelector);
      const [storedVariables, setStoredVariables] = useSessionStorageState<Record<string, string>>(`VariablePromptModal:${projectID}`, {});

      const [variables, setVariables] = React.useState(() =>
        Utils.array.unique(variablesToFill).map((name) => ({ name, value: storedVariables[name] ?? '' }))
      );
      const filled = React.useMemo(() => variables.every(({ value }) => !!value), [variables]);

      const onChangeValue = (index: number) => (value: string) => {
        setVariables((prev) => Utils.array.replace(prev, index, { ...prev[index], value }));
      };

      const onCreate = () => {
        const variableMap = Object.fromEntries(variables.map(({ name, value }) => [name, value]));
        setStoredVariables({ ...storedVariables, ...variableMap });
        api.resolve(variableMap);
        api.close();
      };

      return (
        <Modal type={type} maxWidth={400} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
          <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.close} />}>Set Variables</Modal.Header>

          <Modal.Body>
            <Box.FlexColumn gap={16}>
              {variables.map(({ name, value }, index) => (
                <VariableInput key={name} name={name} value={String(value ?? '')} onChange={onChangeValue(index)} autoFocus={index === 0} />
              ))}
            </Box.FlexColumn>
          </Modal.Body>

          <Modal.Footer gap={12}>
            <Button onClick={() => api.close()} variant={Button.Variant.TERTIARY} squareRadius>
              Cancel
            </Button>

            <Button onClick={onCreate} disabled={!filled}>
              Generate
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
);

export const useFillVariables = () => {
  const variablePrompt = useModal(VariablePrompt);

  return React.useCallback(async <T extends unknown>(context: T): Promise<T | null> => {
    const variablesToFill = deepVariableSearch(context, SLOT_REGEXP);

    if (!variablesToFill.length) {
      return context;
    }

    // if closed return null
    const filledVariables = await variablePrompt.openVoid({ variablesToFill });
    if (!filledVariables) return null;

    return deepVariableReplacement(context, filledVariables, SLOT_REGEXP);
  }, []);
};

export default VariablePrompt;
