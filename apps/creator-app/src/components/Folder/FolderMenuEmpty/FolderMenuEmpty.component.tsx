import { EmptyPage, Surface } from '@voiceflow/ui-next';
import React from 'react';

import { CMS_FOLDER_LEARN_MORE } from '@/constants/link.constant';
import { useFolderCreateModal } from '@/hooks/modal.hook';

import type { IFolderMenuEmpty } from './FolderMenuEmpty.interface';

export const FolderMenuEmpty: React.FC<IFolderMenuEmpty> = ({ width, scope, parentID, onCreated }) => {
  const createModal = useFolderCreateModal();

  const onCreate = async () => {
    try {
      const folder = await createModal.open({ scope, parentID });

      onCreated?.(folder);
    } catch {
      // closed
    }
  };

  return (
    <Surface px={24} pt={24} pb={8} width={width ? `${width}px` : undefined} justify="center" minWidth={0}>
      <EmptyPage
        title="No folder exist"
        button={{ label: 'Create folder', onClick: onCreate }}
        description="Folders are organization layers across all CMS pages. "
        illustration="NoContent"
        learnMoreLink={CMS_FOLDER_LEARN_MORE}
      />
    </Surface>
  );
};
