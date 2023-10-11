/* eslint-disable no-await-in-loop */
import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Box, Button, LoadingSpinner, Menu, Popper, toast } from '@voiceflow/ui-next';
import React from 'react';

import { MenuItemWithTooltip } from '@/components/Menu/MenuItemWithTooltip/MenuItemWithTooltip.component';
import { TooltipContentLearn } from '@/components/Tooltip/TooltipContentLearn/TooltipContentLearn.component';
import { useTrackingEvents } from '@/hooks';
import { usePopperModifiers } from '@/hooks/popper.hook';
import * as ModalsV2 from '@/ModalsV2';
import { KnowledgeBaseContext } from '@/pages/KnowledgeBase/context';
import { KnowledgeBaseSiteMapModal, KnowledgeBaseURLsModal } from '@/pages/KnowledgeBase/Web';
import { upload } from '@/utils/dom';
import { stopPropagation } from '@/utils/handler.util';

import { ACCEPT_TYPES, MIN_MENU_WIDTH } from '../CMSKnowledgeBaseHeader.constant';

export const CMSAddDataSourceButton: React.FC = () => {
  const [trackingEvents] = useTrackingEvents();
  const { actions } = React.useContext(KnowledgeBaseContext);
  const [loading, setLoading] = React.useState(false);

  const urlsModal = ModalsV2.useModal(KnowledgeBaseURLsModal);
  const sitemapModal = ModalsV2.useModal(KnowledgeBaseSiteMapModal);

  const addSource = () => () => {
    upload(
      async (files) => {
        try {
          setLoading(true);
          await actions.upload(files);
          await trackingEvents.trackAiKnowledgeBaseSourceAdded({ Type: BaseModels.Project.KnowledgeBaseDocumentType.PDF });
        } finally {
          setLoading(false);
        }
      },
      { accept: ACCEPT_TYPES.join(','), multiple: true }
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

  const options = React.useMemo(
    () => [
      {
        label: 'Upload file',
        onClick: addSource(),
        tooltipLabel: 'Supported file formats: .pdf, .txt, .docx. Max file size: 10mb.',
        onTooltipLearnClick: () => {},
      },
      {
        label: 'URL(s)',
        onClick: () => urlsModal.openVoid({ save: addURLs }),
        tooltipLabel: 'Import web page content from public URLs directly into your knowledge base.',
        onTooltipLearnClick: () => {},
      },
      {
        label: 'Sitemap',
        onClick: () => sitemapModal.openVoid({ save: addURLs }),
        tooltipLabel: `Import your website's sitemap URL to automatically fetch and organize the URLs of your website's pages.`,
        onTooltipLearnClick: () => {},
      },
    ],
    []
  );

  const modifiers = usePopperModifiers([{ name: 'preventOverflow', options: { padding: 8 } }]);

  return (
    <Popper
      modifiers={modifiers}
      referenceElement={({ ref, popper, isOpen, onOpen }) => (
        <>
          {loading ? (
            <Box>
              <Button disabled>
                <LoadingSpinner size="medium" variant="light" />
              </Button>
            </Box>
          ) : (
            <Button ref={ref} label="Add data source" isActive={isOpen} onClick={() => onOpen()}>
              {popper}
            </Button>
          )}
        </>
      )}
    >
      {({ onClose, referenceRef }) => (
        <Menu width={referenceRef.current?.clientWidth ?? MIN_MENU_WIDTH}>
          {options.map(
            (option, index) =>
              option && (
                <MenuItemWithTooltip
                  key={index}
                  tooltip={{ width: 200 }}
                  label={option.label}
                  onClick={stopPropagation(Utils.functional.chain(option.onClick, onClose))}
                >
                  {() => (
                    <TooltipContentLearn
                      label={option.tooltipLabel}
                      onLearnClick={() => option.onTooltipLearnClick && option?.onTooltipLearnClick()}
                    />
                  )}
                </MenuItemWithTooltip>
              )
          )}
        </Menu>
      )}
    </Popper>
  );
};
