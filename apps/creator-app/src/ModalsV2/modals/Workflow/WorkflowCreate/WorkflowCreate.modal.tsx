import type { Workflow } from '@voiceflow/dtos';
import React from 'react';

import { Modal } from '@/components/Modal';
import { Designer, Router } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';

import { modalsManager } from '../../../manager';
import { useWorkflowCreateForm } from './WorkflowCreate.hook';
import { WorkflowCreateForm } from './WorkflowCreateForm.component';

export interface IWorkflowCreateModal {
  name?: string;
  folderID: string | null;
  jumpTo?: boolean;
}

export const WorkflowCreateModal = modalsManager.create<IWorkflowCreateModal, Workflow & { triggerNodeID: string | null }>(
  'WorkflowCreateModal',
  () =>
    ({ api, type: typeProp, jumpTo, name, opened, hidden, animated, folderID, closePrevented }) => {
      const TEST_ID = 'workflow-create';
      const goToDiagram = useDispatch(Router.goToDiagram);
      const createOne = useDispatch(Designer.Workflow.effect.createOne);

      const { onSubmit, nameState, description, setDescription } = useWorkflowCreateForm({
        api,
        data: { name, folderID },
        create: async (data) => {
          const workflow = await createOne(data);
          if (jumpTo) {
            goToDiagram(workflow.diagramID, workflow.triggerNodeID || undefined);
          }
          api.resolve(workflow);
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

            <Modal.Footer.Button label="Create workflow" variant="primary" onClick={onSubmit} disabled={closePrevented} isLoading={closePrevented} />
          </Modal.Footer>
        </Modal.Container>
      );
    },
  { backdropDisabled: true }
);
