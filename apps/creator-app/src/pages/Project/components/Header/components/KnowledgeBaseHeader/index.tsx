import { BaseModels } from '@voiceflow/base-types';
import { Box, Button, ButtonVariant, Dropdown, SvgIcon, ThemeColor, TippyTooltip, toast } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import { useTrackingEvents } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { KnowledgeBaseContext } from '@/pages/KnowledgeBase/context';
import KnowledgeBaseSettingsModal from '@/pages/KnowledgeBase/Settings';
import KnowledgeBaseTestModal from '@/pages/KnowledgeBase/Test';
import KnowledgeBaseWebModal from '@/pages/KnowledgeBase/Web';
import Search from '@/pages/Project/components/Header/components/NLUHeader/components/Search';
import { useLogoButtonOptions } from '@/pages/Project/components/Header/hooks';
import { upload } from '@/utils/dom';

import { SharePopperProvider } from '../../contexts';

const ACCEPT_TYPES: { [key in BaseModels.Project.KnowledgeBaseDocumentType]?: string } = {
  [BaseModels.Project.KnowledgeBaseDocumentType.TEXT]: '.txt',
  [BaseModels.Project.KnowledgeBaseDocumentType.PDF]: '.pdf',
  [BaseModels.Project.KnowledgeBaseDocumentType.DOCX]: '.docx,.doc',
};

const KnowledgeBaseHeader: React.FC = () => {
  const [trackingEvents] = useTrackingEvents();
  const logoOptions = useLogoButtonOptions();
  const {
    actions,
    filter,
    state: { documents },
  } = React.useContext(KnowledgeBaseContext);
  const [loading, setLoading] = React.useState(false);

  const addSource = (type: BaseModels.Project.KnowledgeBaseDocumentType) => () => {
    const accept = ACCEPT_TYPES[type];

    if (!accept) {
      toast.error('Invalid file type');
      return;
    }

    upload(
      async (files) => {
        try {
          setLoading(true);
          await actions.upload(files);
          await trackingEvents.trackAiKnowledgeBaseSourceAdded({ Type: type, Success: 'Yes' });
        } catch (e) {
          await trackingEvents.trackAiKnowledgeBaseSourceAdded({ Type: type, Success: 'No' });
        } finally {
          setLoading(false);
        }
      },
      { accept, multiple: false }
    );
  };

  const addURLs = async (urls: string[]) => {
    try {
      setLoading(true);
      await actions.create(urls.map((url) => ({ type: BaseModels.Project.KnowledgeBaseDocumentType.URL, name: url, url })));
      await trackingEvents.trackAiKnowledgeBaseSourceAdded({ Type: BaseModels.Project.KnowledgeBaseDocumentType.URL, Success: 'Yes' });
    } catch {
      await trackingEvents.trackAiKnowledgeBaseSourceAdded({ Type: BaseModels.Project.KnowledgeBaseDocumentType.URL, Success: 'No' });
    } finally {
      setLoading(false);
    }
  };

  const settingsModal = ModalsV2.useModal(KnowledgeBaseSettingsModal);
  const webModal = ModalsV2.useModal(KnowledgeBaseWebModal);
  const testModal = ModalsV2.useModal(KnowledgeBaseTestModal);

  const options = React.useMemo(
    () => [
      { label: 'URL(s)', onClick: () => webModal.openVoid({ save: addURLs }) },
      { label: 'Text', onClick: addSource(BaseModels.Project.KnowledgeBaseDocumentType.TEXT) },
      { label: 'PDF', onClick: addSource(BaseModels.Project.KnowledgeBaseDocumentType.PDF) },
      { label: 'DOCX', onClick: addSource(BaseModels.Project.KnowledgeBaseDocumentType.DOCX) },
    ],
    []
  );

  return (
    <SharePopperProvider>
      <Page.Header renderLogoButton={() => <Page.Header.LogoButton options={logoOptions} />}>
        <Page.Header.NavLinkSidebarTitle>Knowledge Base</Page.Header.NavLinkSidebarTitle>
        <Box.FlexApart pl={32} width="100%" pr={12}>
          <Search
            value={filter.search}
            onChange={filter.setSearch}
            placeholder={`Search ${documents.length} document${documents.length === 1 ? '' : 's'}`}
          />
          <Box.Flex gap={8}>
            <TippyTooltip content="Settings">
              <Button icon="filter" variant={ButtonVariant.SECONDARY} onClick={settingsModal.openVoid} />
            </TippyTooltip>
            <TippyTooltip content="Preview">
              <Button variant={ButtonVariant.SECONDARY} onClick={testModal.openVoid}>
                <Box.Flex gap={12} color={ThemeColor.SECONDARY}>
                  <SvgIcon icon="ai" />
                  Preview
                </Box.Flex>
              </Button>
            </TippyTooltip>

            {loading ? (
              <Button disabled width={160}>
                <SvgIcon icon="arrowSpin" spin />
              </Button>
            ) : (
              <Dropdown options={options} placement="bottom-end" menuWidth={160}>
                {({ onToggle, ref }) => (
                  <Button ref={ref} onClick={onToggle} width={160}>
                    Add Data Source
                  </Button>
                )}
              </Dropdown>
            )}
          </Box.Flex>
        </Box.FlexApart>
      </Page.Header>
    </SharePopperProvider>
  );
};

export default KnowledgeBaseHeader;
