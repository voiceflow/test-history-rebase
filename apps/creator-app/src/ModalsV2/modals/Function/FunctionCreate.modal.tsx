import type { Function as FunctionType } from '@voiceflow/dtos';
import { toast } from '@voiceflow/ui';
import { TextArea } from '@voiceflow/ui-next';
import { validatorFactory } from '@voiceflow/utils-designer';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { CMSFormName } from '@/components/CMS/CMSForm/CMSFormName/CMSFormName.component';
import { Modal } from '@/components/Modal';
import { CMS_FUNCTION_DEFAULT_CODE } from '@/constants/cms/function.constant';
import { Designer } from '@/ducks';
import { useInputState } from '@/hooks/input.hook';
import { useDispatch } from '@/hooks/store.hook';
import { useValidators } from '@/hooks/validate.hook';

import { modalsManager } from '../../manager';
import { textareaStyles } from './FunctionCreate.css';

export interface IFunctionCreateModal {
  name?: string;
  folderID: string | null;
  getResourcePath: (resourceID: string) => { path: string; isFolder: boolean };
}

export const FunctionCreateModalID = 'FunctionCreateModal';

export const FunctionCreateModal = modalsManager.create<IFunctionCreateModal, FunctionType>(
  FunctionCreateModalID,
  () =>
    ({ api, type: typeProp, name: nameProp, opened, hidden, animated, folderID, getResourcePath, closePrevented }) => {
      const createOne = useDispatch(Designer.Function.effect.createOne);
      const history = useHistory();

      const [description, setDescription] = useState('');
      const nameState = useInputState({ value: nameProp ?? '' });

      const validator = useValidators({
        name: [validatorFactory((name: string) => name.trim(), 'Name is required.'), nameState.setError],
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

          const { path } = getResourcePath(createdFunction.id);
          history.push(path);

          api.resolve(createdFunction);
          api.enableClose();
          api.close();
        } catch (e) {
          toast.genericError();

          api.enableClose();
        }
      });

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
          <Modal.Header title="Create function" onClose={api.onClose} />
          <Modal.Body gap={16}>
            <CMSFormName
              value={nameState.value}
              error={nameState.error}
              autoFocus
              placeholder="Enter function name"
              onValueChange={nameState.setValue}
            />

            <TextArea
              value={description}
              onValueChange={setDescription}
              disabled={closePrevented}
              className={textareaStyles}
              placeholder="Enter a description (optional)"
            />
          </Modal.Body>
          <Modal.Footer>
            <Modal.Footer.Button variant="secondary" onClick={api.onClose} disabled={closePrevented} label="Cancel" />

            <Modal.Footer.Button label="Create function" variant="primary" onClick={onSubmit} disabled={closePrevented} isLoading={closePrevented} />
          </Modal.Footer>
        </Modal.Container>
      );
    }
);
