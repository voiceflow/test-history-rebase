import type { Flow as FlowType } from '@voiceflow/dtos';
import { tid } from '@voiceflow/style';
import { toast } from '@voiceflow/ui';
import { Box, Scroll } from '@voiceflow/ui-next';
import { componentNameValidator } from '@voiceflow/utils-designer';
import React, { useState } from 'react';

import { CMSFormDescription } from '@/components/CMS/CMSForm/CMSFormDescription/CMSFormDescription.component';
import { CMSFormName } from '@/components/CMS/CMSForm/CMSFormName/CMSFormName.component';
import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useInputState } from '@/hooks/input.hook';
import { useDispatch, useGetValueSelector } from '@/hooks/store.hook';
import { useValidators } from '@/hooks/validate.hook';

import { modalsManager } from '../../manager';

const TEST_ID = 'component-create';
export interface IFlowCreateModal {
  name?: string;
  folderID: string | null;
}

export const FlowCreateModal = modalsManager.create<IFlowCreateModal, FlowType>(
  'FlowCreateModal',
  () =>
    ({ api, type: typeProp, name: nameProp, opened, hidden, animated, folderID, closePrevented }) => {
      const createOne = useDispatch(Designer.Flow.effect.createOne);
      const getComponents = useGetValueSelector(Designer.Flow.selectors.all);
      const nameState = useInputState({ value: nameProp ?? '' });
      const validator = useValidators({
        name: [componentNameValidator, nameState.setError],
      });

      const [description, setDescription] = useState<string>('');

      const onCreate = validator.container(
        async (data) => {
          api.preventClose();

          try {
            const component = await createOne({
              ...data,
              folderID,
              description: description?.trim() || '',
            });

            api.resolve(component);

            api.enableClose();
            api.close();
          } catch (e) {
            toast.genericError();

            api.enableClose();
          }
        },
        () => ({
          components: getComponents(),
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
