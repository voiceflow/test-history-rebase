import { tid } from '@voiceflow/style';
import { Header } from '@voiceflow/ui-next';
import React from 'react';

import { useModal } from '@/hooks/modal.hook';
import { Modals } from '@/ModalsV2';
import { HEADER_TEST_ID } from '@/pages/AssistantCMS/AssistantCMS.constant';

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
          <Header.Button.IconSecondary iconName="Settings" onClick={() => settingsModal.openVoid()} testID={tid(HEADER_TEST_ID, 'settings')} />
          <Header.Button.Secondary iconName="PlayS" label="Preview" onClick={() => previewModal.openVoid()} testID={tid(HEADER_TEST_ID, 'preview')} />

          <CMSKnowledgeBaseAddDataSourceButton testID={tid(HEADER_TEST_ID, 'add-source')} />
        </>
      }
    />
  );
};
