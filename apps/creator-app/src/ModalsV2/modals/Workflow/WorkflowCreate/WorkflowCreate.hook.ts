import type { Workflow } from '@voiceflow/dtos';
import { toast } from '@voiceflow/ui';
import { flowNameValidator } from '@voiceflow/utils-designer';
import { useState } from 'react';

import { Account } from '@/ducks';
import { useInputState } from '@/hooks/input.hook';
import { useSelector } from '@/hooks/store.hook';
import { useValidators } from '@/hooks/validate.hook';

import { ResultInternalAPI } from '../../../types';

export const useWorkflowCreateForm = ({
  api,
  data: { name, folderID },
  create,
}: {
  api: ResultInternalAPI<any, any>;
  data: { name?: string; folderID: string | null };
  create: (data: Pick<Workflow, 'name' | 'status' | 'assigneeID' | 'folderID' | 'description'>) => Promise<void>;
}) => {
  const userID = useSelector(Account.userIDSelector);

  const nameState = useInputState({ value: name ?? '' });
  const validator = useValidators({
    name: [flowNameValidator, nameState.setError],
  });

  const [description, setDescription] = useState('');

  const onCreate = validator.container(async (data) => {
    api.preventClose();

    try {
      await create({
        ...data,
        status: null,
        folderID,
        assigneeID: userID,
        description: description.trim(),
      });

      api.enableClose();
      api.close();
    } catch (e) {
      toast.genericError();

      api.enableClose();
    }
  });

  const onSubmit = () => onCreate({ name: nameState.value });

  return {
    onSubmit,
    nameState,
    description,
    setDescription,
  };
};
