import type { Flow as FlowType } from '@voiceflow/dtos';
import { toast } from '@voiceflow/ui';
import { Box, InputFormControl, Scroll, TextArea } from '@voiceflow/ui-next';
import { componentNameValidator } from '@voiceflow/utils-designer';
import React, { useState } from 'react';

import { CMSFormName } from '@/components/CMS/CMSForm/CMSFormName/CMSFormName.component';
import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useInputState } from '@/hooks/input.hook';
import { useDispatch, useGetValueSelector } from '@/hooks/store.hook';
import { useValidators } from '@/hooks/validate.hook';

import { modalsManager } from '../../manager';
import { textareaStyles } from './ComponentCreate.css';

export interface IComponentCreateModal {
  name?: string;
  folderID: string | null;
}

export const ComponentCreateModal = modalsManager.create<IComponentCreateModal, FlowType>(
  'ComponentCreateModal',
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
                <InputFormControl label="Description">
                  <TextArea
                    value={description}
                    onValueChange={setDescription}
                    disabled={closePrevented}
                    className={textareaStyles}
                    placeholder="Enter description (optional)"
                    testID="function__description"
                  />
                </InputFormControl>
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
