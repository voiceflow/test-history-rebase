import type { Flow } from '@voiceflow/dtos';
import React from 'react';

import { Modal } from '@/components/Modal';
import { Designer, Router } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';

import { modalsManager } from '../../../manager';
import { useFlowCreateForm } from './FlowCreate.hook';
import { FlowCreateForm } from './FlowCreateForm.component';

export interface IFlowCreateModal {
  name?: string;
  folderID: string | null;
  jumpTo?: boolean;
}

export const FlowCreateModal = modalsManager.create<IFlowCreateModal, Flow>(
  'FlowCreateModal',
  () =>
    ({ api, type: typeProp, jumpTo, name, opened, hidden, animated, folderID, closePrevented }) => {
      const TEST_ID = 'component-create';
      const goToDiagram = useDispatch(Router.goToDiagram);
      const createOne = useDispatch(Designer.Flow.effect.createOne);

      const { onSubmit, nameState, description, setDescription } = useFlowCreateForm({
        api,
        data: { name, folderID },
        create: async (data) => {
          const flow = await createOne(data);
          if (jumpTo) {
            goToDiagram(flow.diagramID);
          }

          api.resolve(flow);
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
