import { EmptyPage, Surface } from '@voiceflow/ui-next';
import React from 'react';

import { CMS_VARIABLE_LEARN_MORE } from '@/constants/link.constant';
import { useVariableCreateModal } from '@/hooks/modal.hook';

import type { IVariableMenuEmpty } from './VariableMenuEmpty.interface';

export const VariableMenuEmpty: React.FC<IVariableMenuEmpty> = ({ width, onCreated }) => {
  const variableCreateModal = useVariableCreateModal();

  const onCreate = async () => {
    try {
      const variable = await variableCreateModal.open({ folderID: null });

      onCreated?.(variable);
    } catch {
      // closed
    }
  };

  return (
    <Surface px={24} pt={24} pb={8} width={width ? `${width}px` : undefined} justify="center" minWidth={0}>
      <EmptyPage
        title="No variables exist"
        button={{ label: 'Create variable', onClick: onCreate }}
        description="Variables are like containers that hold information. You can store data in them and use or remember it later. "
        illustration="NoContent"
        learnMoreLink={CMS_VARIABLE_LEARN_MORE}
      />
    </Surface>
  );
};
