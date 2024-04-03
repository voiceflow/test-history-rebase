import React from 'react';

import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { CreateOneFromSelectionResult } from '@/ducks/designer/flow/flow.effect';
import { useDispatch } from '@/hooks/store.hook';
import { DiagramSelectionPayload } from '@/utils/diagram.utils';

import { modalsManager } from '../../../manager';
import { useFlowCreateForm } from './FlowCreate.hook';
import { FlowCreateForm } from './FlowCreateForm.component';

export interface IFlowCreateFromSelection {
  name?: string;
  folderID: string | null;
  selection: DiagramSelectionPayload;
}

export const FlowCreateFromSelectionModal = modalsManager.create<IFlowCreateFromSelection, CreateOneFromSelectionResult>(
  'FlowCreateFromSelectionModal',
  () =>
    ({ api, type: typeProp, name, opened, hidden, animated, folderID, selection, closePrevented }) => {
      const TEST_ID = 'component-create-from-diagram';

      const createOneFromSelection = useDispatch(Designer.Flow.effect.createOneFromSelection);

      const { onSubmit, nameState, description, setDescription } = useFlowCreateForm({
        api,
        data: { name, folderID },
        create: async (data) => {
          const result = await createOneFromSelection({ data, selection });

          api.resolve(result);
        },
      });

      return (
        <Modal.Container
          type={typeProp}
          opened={opened}
          hidden={hidden}
          animated={animated}
          onExited={api.remove}
          onEscClose={api.onEscClose}
          onEnterSubmit={onSubmit}
        >
          <Modal.Header title="Create component" onClose={api.onClose} />

          <FlowCreateForm
            name={nameState.value}
            testID={TEST_ID}
            disabled={closePrevented}
            nameError={nameState.error}
            description={description}
            onNameChange={nameState.setValue}
            onDescriptionChange={setDescription}
          />

          <Modal.Footer>
            <Modal.Footer.Button variant="secondary" onClick={api.onClose} disabled={closePrevented} label="Cancel" />

            <Modal.Footer.Button label="Create component" variant="primary" onClick={onSubmit} disabled={closePrevented} isLoading={closePrevented} />
          </Modal.Footer>
        </Modal.Container>
      );
    },
  { backdropDisabled: true }
);
