import type { Function as FunctionType } from '@voiceflow/dtos';
import { toast } from '@voiceflow/ui';
import { validatorFactory } from '@voiceflow/utils-designer';
import React, { useState } from 'react';

import { CMSFormDescription } from '@/components/CMS/CMSForm/CMSFormDescription/CMSFormDescription.component';
import { CMSFormName } from '@/components/CMS/CMSForm/CMSFormName/CMSFormName.component';
import { Modal } from '@/components/Modal';
import { CMS_FUNCTION_DEFAULT_CODE } from '@/constants/cms/function.constant';
import { Designer } from '@/ducks';
import { useInputState } from '@/hooks/input.hook';
import { useDispatch } from '@/hooks/store.hook';
import { useValidators } from '@/hooks/validate.hook';

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
      const nameState = useInputState({ value: nameProp ?? '' });

      const validator = useValidators({
        name: [validatorFactory((name: string) => name.trim(), 'Name is required'), nameState.setError],
      });

      const onCreate = validator.container(async (fields) => {
        api.preventClose();

        try {
          const createdFunction = await createOne({
            ...fields,
            code: CMS_FUNCTION_DEFAULT_CODE,
            image: null,
            folderID,
            description,
          });

          api.resolve(createdFunction);
          api.enableClose();
          api.close();
        } catch (e) {
          toast.genericError();

          api.enableClose();
        }
      });

      return (
        <Modal.Container type={typeProp} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} onEscClose={api.close}>
          <Modal.Header title="Create function" onClose={api.close} />
          <Modal.Body gap={16}>
            <CMSFormName
              value={nameState.value}
              error={nameState.error}
              autoFocus
              placeholder="Enter function name"
              onValueChange={nameState.setValue}
            />

            <CMSFormDescription value={description} placeholder="Enter a description" onValueChange={setDescription} />
          </Modal.Body>
          <Modal.Footer>
            <Modal.Footer.Button variant="secondary" onClick={api.close} disabled={closePrevented} label="Cancel" />

            <Modal.Footer.Button
              label="Create function"
              variant="primary"
              onClick={() => onCreate({ name: nameState.value })}
              disabled={closePrevented}
            />
          </Modal.Footer>
        </Modal.Container>
      );
    }
);
