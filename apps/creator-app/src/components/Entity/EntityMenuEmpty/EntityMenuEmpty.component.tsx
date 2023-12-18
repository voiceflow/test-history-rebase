import { EmptyPage, Surface } from '@voiceflow/ui-next';
import React from 'react';

import { CMS_ENTITY_LEARN_MORE } from '@/constants/link.constant';
import { useEntityCreateModalV2 } from '@/hooks/modal.hook';

import type { IEntityMenuEmpty } from './EntityMenuEmpty.interface';

export const EntityMenuEmpty: React.FC<IEntityMenuEmpty> = ({ width, onCreated }) => {
  const createModal = useEntityCreateModalV2();

  const onCreate = async () => {
    try {
      const entity = await createModal.open({ folderID: null });

      onCreated?.(entity);
    } catch {
      // closed
    }
  };

  return (
    <Surface px={24} pt={24} pb={8} width={width ? `${width}px` : undefined} justify="center" minWidth="fit-content">
      <EmptyPage
        title="No entities exist"
        button={{ label: 'Create entity', onClick: onCreate }}
        description="Entities help your assistant know which data to pluck out from the users response. "
        illustration="NoContent"
        learnMoreLink={CMS_ENTITY_LEARN_MORE}
      />
    </Surface>
  );
};
