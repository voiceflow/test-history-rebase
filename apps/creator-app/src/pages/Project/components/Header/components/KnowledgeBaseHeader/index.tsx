/* eslint-disable no-await-in-loop */
import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Box, Button, ButtonVariant, Dropdown, SvgIcon, ThemeColor, TippyTooltip, toast } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import { Permission } from '@/constants/permissions';
import { usePermission, useTrackingEvents } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { KnowledgeBaseContext } from '@/pages/KnowledgeBase/context';
import KnowledgeBaseSettingsModal from '@/pages/KnowledgeBase/Settings';
import KnowledgeBaseTestModal from '@/pages/KnowledgeBase/Test';
import { KnowledgeBaseSiteMapModal, KnowledgeBaseURLsModal } from '@/pages/KnowledgeBase/Web';
import Search from '@/pages/Project/components/Header/components/NLUHeader/components/Search';
import { useLogoButtonOptions } from '@/pages/Project/components/Header/hooks';
import { upload } from '@/utils/dom';

import { SharePopperProvider } from '../../contexts';
import { ACCEPT_TYPES, createOptionLabel } from './utils';

const KnowledgeBaseHeader: React.FC = () => {
  const logoOptions = useLogoButtonOptions();
  const [canEditProject] = usePermission(Permission.PROJECT_EDIT);
  const [trackingEvents] = useTrackingEvents();

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
          await trackingEvents.trackAiKnowledgeBaseSourceAdded({ Type: type });
        } finally {
          setLoading(false);
        }
      },
      { accept, multiple: true }
    );
  };

  const addURLs = async (urls: string[]) => {
    const infoToastID = toast.info('Adding URLs, please do not close this window.', { autoClose: false });
    try {
      setLoading(true);
      const BATCH_SIZE = 5;
      for (let i = 0; i < urls.length; i += BATCH_SIZE) {
        await actions.create(
          urls.slice(i, i + BATCH_SIZE).map((url) => ({ type: BaseModels.Project.KnowledgeBaseDocumentType.URL, name: url, url }))
        );
        await Utils.promise.delay(4000);
      }
      trackingEvents.trackAiKnowledgeBaseSourceAdded({ Type: BaseModels.Project.KnowledgeBaseDocumentType.URL });
    } finally {
      setLoading(false);
      toast.dismiss(infoToastID);
    }
  };

  const settingsModal = ModalsV2.useModal(KnowledgeBaseSettingsModal);
  const urlsModal = ModalsV2.useModal(KnowledgeBaseURLsModal);
  const sitemapModal = ModalsV2.useModal(KnowledgeBaseSiteMapModal);
  const testModal = ModalsV2.useModal(KnowledgeBaseTestModal);

  const options = React.useMemo(
    () => [
      { label: createOptionLabel('URL(s)'), onClick: () => urlsModal.openVoid({ save: addURLs }) },
      { label: createOptionLabel('Sitemap'), onClick: () => sitemapModal.openVoid({ save: addURLs }) },
      { label: createOptionLabel('Text', '10mb max'), onClick: addSource(BaseModels.Project.KnowledgeBaseDocumentType.TEXT) },
      {
        label: createOptionLabel('PDF', '10mb max'),
        onClick: addSource(BaseModels.Project.KnowledgeBaseDocumentType.PDF),
      },
      { label: createOptionLabel('DOC', '10mb max'), onClick: addSource(BaseModels.Project.KnowledgeBaseDocumentType.DOCX) },
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

            {canEditProject && (
              <>
                {loading ? (
                  <Button disabled width={160}>
                    <SvgIcon icon="arrowSpin" spin />
                  </Button>
                ) : (
                  <Dropdown options={options} placement="bottom-end">
                    {({ onToggle, ref }) => (
                      <Button ref={ref} onClick={onToggle} width={160}>
                        Add Data Source
                      </Button>
                    )}
                  </Dropdown>
                )}
              </>
            )}
          </Box.Flex>
        </Box.FlexApart>
      </Page.Header>
    </SharePopperProvider>
  );
};

export default KnowledgeBaseHeader;
