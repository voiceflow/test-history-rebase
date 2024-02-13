import type { Folder } from '@voiceflow/dtos';
import { FolderScope } from '@voiceflow/dtos';
import { notify, Scroll } from '@voiceflow/ui-next';
import { validatorFactory } from '@voiceflow/utils-designer';
import React from 'react';

import { CMSFormName } from '@/components/CMS/CMSForm/CMSFormName/CMSFormName.component';
import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useInputState } from '@/hooks/input.hook';
import { useDispatch } from '@/hooks/store.hook';
import { useValidators } from '@/hooks/validate.hook';

import { modalsManager } from '../../manager';

export interface IFolderCreateModal {
  name?: string;
  scope: FolderScope;
  parentID: string | null;
}

export const FolderCreateModal = modalsManager.create<IFolderCreateModal, Folder>(
  'FolderCreateModal',
  () =>
    ({ api, type: typeProp, name: nameProp, scope, opened, hidden, animated, parentID, closePrevented }) => {
      const createOne = useDispatch(Designer.Folder.effect.createOne);

      const nameState = useInputState({ value: nameProp ?? '' });

      const validator = useValidators({
        name: [validatorFactory((name: string) => !!name, 'Folder name is required.'), nameState.setError],
      });

      const onCreate = validator.container(async ({ name }) => {
        api.preventClose();

        try {
          const folder = await createOne({
            name,
            scope,
            parentID,
          });

          api.resolve(folder);
          api.enableClose();
          api.close();
        } catch (e) {
          notify.short.genericError();

          api.enableClose();
        }
      });

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
          <Modal.Header title="Create folder" onClose={api.onClose} />

          <Scroll style={{ display: 'block' }}>
            <Modal.Body>
              <CMSFormName
                value={nameState.value}
                error={nameState.error}
                disabled={closePrevented}
                autoFocus
                placeholder="Enter folder name"
                onValueChange={nameState.setValue}
              />
            </Modal.Body>
          </Scroll>

          <Modal.Footer>
            <Modal.Footer.Button variant="secondary" onClick={api.onClose} disabled={closePrevented} label="Cancel" />

            <Modal.Footer.Button label="Create folder" variant="primary" onClick={onSubmit} disabled={closePrevented} isLoading={closePrevented} />
          </Modal.Footer>
        </Modal.Container>
      );
    }
);
