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
import { CreateDiagramWithDataOptions } from '@/utils/diagram.utils';

import { modalsManager } from '../../manager';

export interface IFlowCreateFromDiagramModal {
  diagramOptions: CreateDiagramWithDataOptions;
  folderID: string | null;
  name?: string;
}

export const FlowCreateFromDiagramModal = modalsManager.create<IFlowCreateFromDiagramModal, CreateOneFromSelectionResult>(
  'FlowCreateFromDiagramModal',
  () =>
    ({ api, type: typeProp, name: nameProp, opened, hidden, animated, folderID, closePrevented, diagramOptions }) => {
      const TEST_ID = 'component-create-from-diagram';
      const createOneFromSelection = useDispatch(Designer.Flow.effect.createOneFromSelection);
      const getFlows = useGetValueSelector(Designer.Flow.selectors.all);
      const nameState = useInputState({ value: nameProp ?? '' });
      const validator = useValidators({
        name: [flowNameValidator, nameState.setError],
      });

      const [description, setDescription] = useState('');

      const onCreate = validator.container(
        async (data) => {
          api.preventClose();

          try {
            const response = await createOneFromSelection({
              data: {
                folderID,
                name: data.name,
                description: description.trim(),
              },
              diagramOptions,
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

      api.useOnCloseRequest((source) => source !== 'backdrop');

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
                  disabled={closePrevented}
                  placeholder="Enter description (optional)"
                  onValueChange={setDescription}
                  maxRows={25}
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
    }
);
