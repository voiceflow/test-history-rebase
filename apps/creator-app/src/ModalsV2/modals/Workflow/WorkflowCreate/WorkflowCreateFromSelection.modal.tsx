import React from 'react';

import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import type { CreateOneFromSelectionResult } from '@/ducks/designer/flow/flow.effect';
import { useDispatch } from '@/hooks/store.hook';
import type { DiagramSelectionPayload } from '@/utils/diagram.utils';

import { modalsManager } from '../../../manager';
import { useWorkflowCreateForm } from './WorkflowCreate.hook';
import { WorkflowCreateForm } from './WorkflowCreateForm.component';

export interface IWorkflowCreateFromSelectionModal {
  name?: string;
  folderID: string | null;
  selection: DiagramSelectionPayload;
}

export const WorkflowCreateFromSelectionModal = modalsManager.create<
  IWorkflowCreateFromSelectionModal,
  CreateOneFromSelectionResult
>(
  'WorkflowCreateFromSelectionModal',
  () =>
    ({ api, type: typeProp, name, opened, hidden, animated, folderID, selection, closePrevented }) => {
      const TEST_ID = 'workflow-create-from-diagram';

      const createOneFromSelection = useDispatch(Designer.Workflow.effect.createOneFromSelection);

      const { onSubmit, nameState, description, setDescription } = useWorkflowCreateForm({
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
          <Modal.Header title="Create workflow" onClose={api.onClose} />

          <WorkflowCreateForm
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

            <Modal.Footer.Button
              label="Create workflow"
              variant="primary"
              onClick={onSubmit}
              disabled={closePrevented}
              isLoading={closePrevented}
            />
          </Modal.Footer>
        </Modal.Container>
      );
    },
  { backdropDisabled: true }
);
