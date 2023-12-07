import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { useAsyncMountUnmount } from '@voiceflow/ui';
import { Header, SearchInput, toast } from '@voiceflow/ui-next';
import React from 'react';

import client from '@/client';
import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { CMSHeaderMembers } from '@/pages/AssistantCMS/components/CMSHeader/CMSHeaderMembers/CMSHeaderMembers.component';
import { CMSKnowledgeBaseContext } from '@/pages/AssistantCMS/contexts/CMSKnowledgeBase.context';

import { CMSAddDataSourceButton } from './components/AddDataSourceButton.component';

export const CMSKnowledgeBaseHeader: React.FC = () => {
  const projectID = useSelector(Session.activeProjectIDSelector);
  const versionID = useSelector(Session.activeVersionIDSelector);
  const getIsFeatureEnabled = useSelector(Feature.isFeatureEnabledSelector);

  const { filter } = React.useContext(CMSKnowledgeBaseContext);
  const settingsModal = ModalsV2.useModal(ModalsV2.KnowledgeBase.Settings);
  const previewModal = ModalsV2.useModal(ModalsV2.KnowledgeBase.PreviewQuestion);

  const [initialSettings, setInitialSettings] = React.useState<BaseModels.Project.KnowledgeBaseSettings | null>(null);

  useAsyncMountUnmount(async () => {
    let data;
    if (getIsFeatureEnabled(Realtime.FeatureFlag.VERSIONED_KB_SETTINGS)) {
      ({ data } = await client.api.fetch.get<BaseModels.Project.KnowledgeBaseSettings>(`/versions/${versionID}/knowledge-base/settings`).catch(() => {
        toast.error('Unable to fetch Knowledge Base settings');
        return { data: null };
      }));
    } else {
      ({ data } = await client.apiV3.fetch
        .get<BaseModels.Project.KnowledgeBaseSettings>(`/projects/${projectID}/knowledge-base/settings`)
        .catch(() => {
          toast.error('Unable to fetch Knowledge Base settings');
          return { data: null };
        }));
    }

    setInitialSettings(data);
  });

  return (
    <Header variant="search">
      <Header.Section.Left>
        <SearchInput value={filter.search} placeholder="Search data sources" onValueChange={filter.setSearch} />
      </Header.Section.Left>
      <Header.Section.Right>
        <CMSHeaderMembers />
        <Header.Section.RightActions>
          <Header.Button.IconSecondary iconName="Settings" onClick={() => settingsModal.openVoid({ initialSettings })} />
          <Header.Button.Secondary iconName="PlayS" label="Preview" onClick={() => previewModal.openVoid()} />
          <CMSAddDataSourceButton />
        </Header.Section.RightActions>
      </Header.Section.Right>
    </Header>
  );
};
