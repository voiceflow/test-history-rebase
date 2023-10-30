import type { Function as FunctionType } from '@voiceflow/sdk-logux-designer';
import { toast } from '@voiceflow/ui';
import { Scroll } from '@voiceflow/ui-next';
import React, { useState } from 'react';

import { CMSFormDescription } from '@/components/CMS/CMSForm/CMSFormDescription/CMSFormDescription.component';
import { CMSFormName } from '@/components/CMS/CMSForm/CMSFormName/CMSFormName.component';
import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useInputStateWithError } from '@/hooks/input.hook';
import { useDispatch } from '@/hooks/store.hook';
import { useValidator } from '@/hooks/validate.hook';
import { requiredNameValidator } from '@/utils/validation.util';

import { modalsManager } from '../../manager';

export interface IFunctionCreateModal {
  name?: string;
  folderID: string | null;
}

export const FunctionCreateModal = modalsManager.create<IFunctionCreateModal, FunctionType>(
  'FunctionCreateModal',
  () =>
    ({ api, type: typeProp, name: nameProp, opened, hidden, animated, folderID, closePrevented }) => {
      const createOne = useDispatch(Designer.Function.effect.createOne);

      const [description, setDescription] = useState('');
      const [name, nameError, setName, setNameError] = useInputStateWithError(nameProp ?? '');

      const validator = useValidator<{ name: string }>({
        setNameError,
        validateName: requiredNameValidator,
      });

      const onCreate = validator.container(async ({ ...fields }) => {
        api.preventClose();

        try {
          const intent = await createOne({
            ...fields,
            code: '',
            image: null,
            folderID,
            description,
          });

          api.resolve(intent);
          api.enableClose();
          api.close();
        } catch (e) {
          toast.genericError();

          api.enableClose();
        }
      });

      return (
        <Modal type={typeProp} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
          <Modal.Header title="Create function" onClose={api.close} />

          <Scroll>
            <CMSFormName pb={20} value={name} error={nameError} autoFocus placeholder="Enter function name" onValueChange={setName} />

            <CMSFormDescription value={description} placeholder="Enter a description" onValueChange={setDescription} />
          </Scroll>
          <Modal.Footer>
            <Modal.Footer.Button variant="secondary" onClick={api.close} disabled={closePrevented} label="Cancel" />

            <Modal.Footer.Button label="Create Function" variant="primary" onClick={() => onCreate({ name })} disabled={closePrevented} />
          </Modal.Footer>
        </Modal>
      );
    }
);
