import type { Flow } from '@voiceflow/dtos';
import { toast } from '@voiceflow/ui';
import { flowNameValidator } from '@voiceflow/utils-designer';
import { useState } from 'react';

import { useInputState } from '@/hooks/input.hook';
import { useValidators } from '@/hooks/validate.hook';

import { ResultInternalAPI } from '../../../types';

export const useFlowCreateForm = ({
  api,
  data: { name, folderID },
  create,
}: {
  api: ResultInternalAPI<any, any>;
  data: { name?: string; folderID: string | null };
  create: (data: Pick<Flow, 'name' | 'folderID' | 'description'>) => Promise<void>;
}) => {
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
        folderID,
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
