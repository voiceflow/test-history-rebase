import { Header, SearchInput } from '@voiceflow/ui-next';
import React from 'react';

import * as ModalsV2 from '@/ModalsV2';
import { CMSHeaderMembers } from '@/pages/AssistantCMS/components/CMSHeader/CMSHeaderMembers/CMSHeaderMembers.component';
import { KnowledgeBaseContext } from '@/pages/KnowledgeBase/context';

import { CMSAddDataSourceButton } from './components/AddDataSourceButton.component';

export const CMSKnowledgeBaseHeader: React.FC = () => {
  const { filter } = React.useContext(KnowledgeBaseContext);
  const settingsModal = ModalsV2.useModal(ModalsV2.KnowledgeBase.Settings);
  const previewModal = ModalsV2.useModal(ModalsV2.KnowledgeBase.Preview);

  return (
    <Header variant="search">
      <Header.Section.Left>
        <SearchInput value={filter.search} placeholder="Search data sources" onValueChange={filter.setSearch} />
      </Header.Section.Left>
      <Header.Section.Right>
        <CMSHeaderMembers />
        <Header.Section.RightActions>
          <Header.Button.IconSecondary iconName="Settings" onClick={() => settingsModal.openVoid()} />
          <Header.Button.Secondary iconName="PlayS" label="Preview" onClick={() => previewModal.openVoid()} />
          <CMSAddDataSourceButton />
        </Header.Section.RightActions>
      </Header.Section.Right>
    </Header>
  );
};
