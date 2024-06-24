'use client';

import { useState } from 'react';

import { encodeWorkspaceID } from '@/actions/workspace.action';
import { FormCard } from '@/components/form/form-card.component';
import { FormSubmitButton } from '@/components/form/form-sumit-button.component';
import { InputNumber } from '@/components/input/input-number.component';
import { InputText } from '@/components/input/input-text.component';
import { View } from '@/components/view.component';
import { useFormState } from '@/hooks/form.hook';

export const EncodeWorkspaceIDView = () => {
  const [workspaceID, setWorkspaceID] = useState<null | string>(null);

  const form = useFormState({
    initialState: { workspaceID: 0 },

    onSubmit: async (data) => {
      const result = await encodeWorkspaceID(Number(data.workspaceID));

      if (result === null) {
        throw new Error('ID is invalid');
      }

      setWorkspaceID(result);
    },
  });

  return (
    <View
      form={
        <FormCard
          onSubmit={form.onSubmit}
          action={<FormSubmitButton label="Encode" disabled={!form.state.workspaceID} loading={form.submitting} />}
        >
          <InputNumber
            label="Workspace id"
            value={form.state.workspaceID}
            error={form.stateError?.workspaceID}
            onValueChange={form.onFieldChange('workspaceID')}
          />
        </FormCard>
      }
    >
      {workspaceID !== null && (
        <FormCard>
          <InputText label="Encoded workspace id" value={String(workspaceID)} readOnly />
        </FormCard>
      )}
    </View>
  );
};

export default EncodeWorkspaceIDView;
