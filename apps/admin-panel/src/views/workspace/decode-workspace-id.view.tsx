'use client';

import { useState } from 'react';

import { decodeWorkspaceID } from '@/actions/workspace.action';
import { FormCard } from '@/components/form/form-card.component';
import { FormSubmitButton } from '@/components/form/form-sumit-button.component';
import { InputNumber } from '@/components/input/input-number.component';
import { InputText } from '@/components/input/input-text.component';
import { View } from '@/components/view.component';
import { useFormState } from '@/hooks/form.hook';

export const DecodeWorkspaceIDView = () => {
  const [workspaceID, setWorkspaceID] = useState<null | number>(null);

  const form = useFormState({
    initialState: { workspaceID: '' },

    onSubmit: async (data) => {
      const result = await decodeWorkspaceID(data.workspaceID);

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
          action={<FormSubmitButton label="Decode" disabled={!form.state.workspaceID} loading={form.submitting} />}
        >
          <InputText
            value={form.state.workspaceID}
            error={form.stateError?.workspaceID}
            label="Encoded workspace id"
            onValueChange={form.onFieldChange('workspaceID')}
          />
        </FormCard>
      }
    >
      {workspaceID !== null && (
        <FormCard>
          <InputNumber label="Workspace id" value={workspaceID} readOnly />
        </FormCard>
      )}
    </View>
  );
};

export default DecodeWorkspaceIDView;
