import { tid } from '@voiceflow/style';
import { toast } from '@voiceflow/ui';
import { Box, Scroll } from '@voiceflow/ui-next';
import { flowNameValidator } from '@voiceflow/utils-designer';
import React, { useState } from 'react';

import { CMSFormDescription } from '@/components/CMS/CMSForm/CMSFormDescription/CMSFormDescription.component';
import { CMSFormName } from '@/components/CMS/CMSForm/CMSFormName/CMSFormName.component';
import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { CreateOneFromSelectionResult } from '@/ducks/designer/flow/flow.effect';
import { useInputState } from '@/hooks/input.hook';
import { useDispatch, useGetValueSelector } from '@/hooks/store.hook';
import { useValidators } from '@/hooks/validate.hook';
import { DiagramSelectionPayload } from '@/utils/diagram.utils';

import { modalsManager } from '../../manager';

export interface IFlowCreateFromDiagramModal {
  name?: string;
  folderID: string | null;
  selection: DiagramSelectionPayload;
}

export const FlowCreateFromDiagramModal = modalsManager.create<IFlowCreateFromDiagramModal, CreateOneFromSelectionResult>(
  'FlowCreateFromDiagramModal',
  () =>
    ({ api, type: typeProp, name: nameProp, opened, hidden, animated, folderID, selection, closePrevented }) => {
      const TEST_ID = 'component-create-from-diagram';

      const getFlows = useGetValueSelector(Designer.Flow.selectors.all);
      const createOneFromSelection = useDispatch(Designer.Flow.effect.createOneFromSelection);

      const nameState = useInputState({ value: nameProp ?? '' });
      const [description, setDescription] = useState('');

      const validator = useValidators({
        name: [flowNameValidator, nameState.setError],
      });

      const onCreate = validator.container(
        async (data) => {
          api.preventClose();

          try {
            const response = await createOneFromSelection({
              data: { name: data.name, folderID, description: description.trim() || null },
              selection,
            });

            api.resolve(response);

            api.enableClose();
            api.close();
          } catch (e) {
            toast.genericError();

            api.enableClose();
          }
        },
        () => ({
          flows: getFlows(),
        })
      );

      const onSubmit = () => onCreate({ name: nameState.value });

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

          <Scroll style={{ display: 'block' }}>
            <Modal.Body gap={16}>
              <CMSFormName
                value={nameState.value}
                error={nameState.error}
                disabled={closePrevented}
                autoFocus
                placeholder="Enter component name"
                onValueChange={nameState.setValue}
              />

              <Box direction="column">
                <CMSFormDescription
                  value={description}
                  testID={tid(TEST_ID, 'description')}
                  maxRows={25}
                  disabled={closePrevented}
                  placeholder="Enter description (optional)"
                  onValueChange={setDescription}
                />
              </Box>
            </Modal.Body>
          </Scroll>

          <Modal.Footer>
            <Modal.Footer.Button variant="secondary" onClick={api.onClose} disabled={closePrevented} label="Cancel" />

            <Modal.Footer.Button label="Create component" variant="primary" onClick={onSubmit} disabled={closePrevented} isLoading={closePrevented} />
          </Modal.Footer>
        </Modal.Container>
      );
    },
  { backdropDisabled: true }
);
