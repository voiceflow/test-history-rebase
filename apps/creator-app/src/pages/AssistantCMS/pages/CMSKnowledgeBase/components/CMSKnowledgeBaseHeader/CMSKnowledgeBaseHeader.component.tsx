import { Header } from '@voiceflow/ui-next';
import React from 'react';

import { useModal } from '@/hooks/modal.hook';
import { Modals } from '@/ModalsV2';

import { CMSHeader } from '../../../../components/CMSHeader/CMSHeader.component';
import { CMSKnowledgeBaseAddDataSourceButton } from '../CMSKnowledgeBaseAddDataSourceButton/CMSKnowledgeBaseAddDataSourceButton.component';

export const CMSKnowledgeBaseHeader: React.FC = () => {
  const previewModal = useModal(Modals.KnowledgeBase.PreviewQuestion);
  const settingsModal = useModal(Modals.KnowledgeBase.Settings);

  return (
    <CMSHeader
      hideShare
      searchPlaceholder="Search data sources"
      rightActions={
        <>
          <Header.Button.IconSecondary iconName="Settings" onClick={() => settingsModal.openVoid()} testID="cms-header__settings" />
          <Header.Button.Secondary iconName="PlayS" label="Preview" onClick={() => previewModal.openVoid()} testID="cms-header__preview" />

          <CMSKnowledgeBaseAddDataSourceButton testID="cms-header__add-source" />
        </>
      }
    />
  );
};
