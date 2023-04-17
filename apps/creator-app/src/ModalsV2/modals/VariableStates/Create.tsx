import { Button, Modal, toast } from '@voiceflow/ui';
import React from 'react';

import * as CreatorV2 from '@/ducks/creatorV2';
import * as VariableState from '@/ducks/variableState';
import { useDispatch, useHotkey, useSelector, useTrackingEvents } from '@/hooks';
import { Hotkey } from '@/keymap';

import manager from '../../manager';
import { Form, FormTypes } from './components';

export type CreateVariableStateModalProps = void;

/**
 * name is used in the modals helpers to fix circular dependency
 */
const Create = manager.create<CreateVariableStateModalProps>('VariableStateCreate', () => ({ api, type, opened, hidden, animated }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const activeDiagramID = useSelector(CreatorV2.activeDiagramIDSelector);

  const createVariableState = useDispatch(VariableState.createVariableState);

  const [trackingEvents] = useTrackingEvents();

  const onSubmit = async ({ name, startFrom, variables }: FormTypes.Value) => {
    try {
      setIsSubmitting(true);

      await createVariableState({
        name,
        startFrom,
        variables: Object.fromEntries(Object.entries(variables).map(([key, value]) => [key, value || 0])),
      });

      trackingEvents.trackVariableStateCreated({ diagramID: startFrom?.diagramID || activeDiagramID });

      api.close();
    } catch {
      toast.error('Failed to create persona.');
    } finally {
      setIsSubmitting(true);
    }
  };

  useHotkey(Hotkey.MODAL_CLOSE, api.close, { preventDefault: true });

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={450}>
      <Modal.Header>Create Persona</Modal.Header>

      <Form onSubmit={onSubmit} />

      <Modal.Footer gap={12}>
        <Button variant={Button.Variant.TERTIARY} onClick={api.close} disabled={isSubmitting} squareRadius>
          Cancel
        </Button>

        <Button form={Form.FORM_ID} variant={Button.Variant.PRIMARY} disabled={isSubmitting} squareRadius>
          Create Persona
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Create;
