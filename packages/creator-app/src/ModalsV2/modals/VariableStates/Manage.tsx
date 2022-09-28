import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, Dropdown, IconButton, IconButtonVariant, Modal, toast } from '@voiceflow/ui';
import React from 'react';

import * as VariableState from '@/ducks/variableState';
import { useDispatch, useHotKeys, useSelector, useTrackingEvents } from '@/hooks';
import { Hotkey } from '@/keymap';

import manager from '../../manager';
import { Form, FormTypes } from './components';

interface Props {
  variableStateID: string;
}

const getDiffValues = (variableState: Realtime.VariableState | null, value: FormTypes.Value) => {
  if (!variableState) return [];

  return Object.keys(
    Utils.object.getTopLevelDiff(
      {
        name: value.name,
        stepID: value.startFrom?.stepID,
        diagramID: value.startFrom?.diagramID,
        variables: value.variables,
      },
      {
        name: variableState.name,
        stepID: variableState.startFrom?.stepID,
        diagramID: variableState.startFrom?.diagramID,
        variables: variableState.variables,
      }
    )
  );
};

const Manage = manager.create<Props>('VariableStateManage', () => ({ api, type, opened, hidden, animated, variableStateID }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const variableState = useSelector(VariableState.variableStateByIDSelector, { id: variableStateID });

  const deleteVariableState = useDispatch(VariableState.deleteState, variableStateID);
  const updateVariableState = useDispatch(VariableState.updateState);

  const [trackingEvents] = useTrackingEvents();

  const onDelete = async () => {
    api.close();

    try {
      await deleteVariableState();

      toast.success('Persona deleted');

      trackingEvents.trackVariableStateDeleted();
    } catch {
      toast.error('Failed to delete persona.');
    }
  };

  const onSubmit = async ({ name, startFrom, variables }: FormTypes.Value) => {
    const changedFields = getDiffValues(variableState, { name, startFrom, variables });

    if (!changedFields.length) {
      api.close();
      return;
    }

    try {
      await updateVariableState(variableStateID, {
        name,
        variables: Object.fromEntries(Object.entries(variables).map(([key, value]) => [key, value ?? ''])),
        startFrom,
      });

      trackingEvents.trackVariableStateEdited({ editedFields: changedFields });

      api.close();
    } catch {
      toast.error('Failed to update persona.');
    } finally {
      setIsSubmitting(true);
    }
  };

  useHotKeys(Hotkey.MODAL_CLOSE, api.close, { preventDefault: true }, [api.close]);

  const options = [{ key: 'delete', label: 'Delete persona', onClick: onDelete }];

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={450}>
      <Modal.Header
        actions={
          <Dropdown options={options}>
            {(ref, onToggle, isOpened) => (
              <IconButton
                ref={ref}
                icon="ellipsis"
                size={14}
                style={{ marginRight: '0px' }}
                variant={IconButtonVariant.BASIC}
                onClick={onToggle}
                activeClick={isOpened}
              />
            )}
          </Dropdown>
        }
      >
        Edit Persona
      </Modal.Header>

      <Form value={variableState} onSubmit={onSubmit} />

      <Modal.Footer gap={12}>
        <Button variant={Button.Variant.TERTIARY} onClick={api.close} disabled={isSubmitting} squareRadius>
          Cancel
        </Button>

        <Button form={Form.FORM_ID} variant={Button.Variant.PRIMARY} disabled={isSubmitting} squareRadius>
          Save Persona
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Manage;
