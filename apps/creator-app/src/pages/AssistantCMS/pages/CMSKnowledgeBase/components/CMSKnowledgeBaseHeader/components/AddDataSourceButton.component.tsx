/* eslint-disable no-await-in-loop */
import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Button, Menu, Popper, toast } from '@voiceflow/ui-next';
import React from 'react';

import { MenuItemWithTooltip } from '@/components/Menu/MenuItemWithTooltip/MenuItemWithTooltip.component';
import { TooltipContentLearn } from '@/components/Tooltip/TooltipContentLearn/TooltipContentLearn.component';
import * as Documentation from '@/config/documentation';
import { useTrackingEvents } from '@/hooks';
import { usePopperModifiers } from '@/hooks/popper.hook';
import * as ModalsV2 from '@/ModalsV2';
import { CMSKnowledgeBaseContext } from '@/pages/AssistantCMS/contexts/CMSKnowledgeBase.context';
import { stopPropagation } from '@/utils/handler.util';
import { openInternalURLInANewTab } from '@/utils/window';

import { MIN_MENU_WIDTH } from '../CMSKnowledgeBaseHeader.constant';
import { BATCH_SIZE, ERROR_MESSAGE } from './AddDaraSourceButton.constant';

interface ICMSAddDataSourceButton {
  buttonVariant?: 'primary' | 'secondary';
}

export const CMSAddDataSourceButton: React.FC<ICMSAddDataSourceButton> = ({ buttonVariant = 'primary' }) => {
  const [trackingEvents] = useTrackingEvents();
  const { actions, state } = React.useContext(CMSKnowledgeBaseContext);

  const filesModal = ModalsV2.useModal(ModalsV2.KnowledgeBase.Import.File);
  const urlsModal = ModalsV2.useModal(ModalsV2.KnowledgeBase.Import.Url);
  const plainTextModal = ModalsV2.useModal(ModalsV2.KnowledgeBase.Import.PlainText);
  const sitemapModal = ModalsV2.useModal(ModalsV2.KnowledgeBase.Import.Sitemap);

  const updateStatuses = (ids: string[]) => {
    const statuses = new Set(state.documents.filter((doc) => ids.includes(doc.documentID)).map((doc) => doc.status.type));
    const pending = statuses.has(
      BaseModels.Project.KnowledgeBaseDocumentStatus.PENDING || BaseModels.Project.KnowledgeBaseDocumentStatus.INITIALIZED
    );
    const error = statuses.has(BaseModels.Project.KnowledgeBaseDocumentStatus.ERROR);
    return { pending, error };
  };

  const checkStatuses = async (ids: string[]) => {
    const statuses = updateStatuses(ids);
    if (statuses.pending) {
      setTimeout(checkStatuses, 5000);
      actions.sync();
    }
  };

  const showToast = async (ids: string[], error?: boolean) => {
    await checkStatuses(ids);
    const statuses = updateStatuses(ids);

    if (statuses.error || error) {
      toast.info('All data sources processed', { showIcon: false });
    } else {
      toast.success(`${ids.length} data sources processed`);
    }
  };

  const addSource = async (files: File[]) => {
    try {
      const docs = await actions.upload(files);
      await trackingEvents.trackAiKnowledgeBaseSourceAdded({ Type: BaseModels.Project.KnowledgeBaseDocumentType.PDF });
      await actions.sync();
      showToast(docs.successes);
    } catch {
      toast.error(ERROR_MESSAGE);
      toast.error(ERROR_MESSAGE, { isClosable: false });
    }
  };

  const addURLs = async (urls: string[]) => {
    try {
      let docs = [] as BaseModels.Project.KnowledgeBaseDocument[];
      let hasError = false;

      for (let i = 0; i < urls.length; i += BATCH_SIZE) {
        const data = await actions.create(
          urls.slice(i, i + BATCH_SIZE).map((url) => ({ type: BaseModels.Project.KnowledgeBaseDocumentType.URL, name: url, url }))
        );
        docs = docs.concat(data.documents);
        hasError = hasError || data.hasError;
        await Utils.promise.delay(4000);
      }

      trackingEvents.trackAiKnowledgeBaseSourceAdded({ Type: BaseModels.Project.KnowledgeBaseDocumentType.URL });

      const ids = docs.map((doc) => doc.documentID);
      showToast(ids, hasError);
    } catch {
      toast.error(ERROR_MESSAGE, { isClosable: false });
    }
  };

  const addPlainText = async (text: string) => {
    try {
      const data = await actions.createDocument(text);
      await trackingEvents.trackAiKnowledgeBaseSourceAdded({ Type: BaseModels.Project.KnowledgeBaseDocumentType.TEXT });
      showToast(
        data.documents.map((doc) => doc.documentID),
        data.hasError
      );
    } catch {
      toast.error(ERROR_MESSAGE, { isClosable: false });
    }
  };

  const options = React.useMemo(
    () => [
      {
        label: 'Plain text',
        onClick: () => plainTextModal.openVoid({ onSave: addPlainText }),
        tooltipLabel: 'Copy and paste, or manually add text directly into your knowledge base.',
        onTooltipLearnClick: () => openInternalURLInANewTab(Documentation.KB_DATA_SOURCES),
      },
      {
        label: 'Upload file',
        onClick: () => filesModal.openVoid({ onSave: addSource }),
        tooltipLabel: 'Supported file formats: .pdf, .txt, .docx. Max file size: 10mb.',
        onTooltipLearnClick: () => openInternalURLInANewTab(Documentation.KB_DATA_SOURCES),
      },
      {
        label: 'URL(s)',
        onClick: () => urlsModal.openVoid({ onSave: addURLs }),
        tooltipLabel: 'Import web page content from public URLs directly into your knowledge base.',
        onTooltipLearnClick: () => openInternalURLInANewTab(Documentation.KB_DATA_SOURCES),
      },
      {
        label: 'Sitemap',
        onClick: () => sitemapModal.openVoid({ onSave: addURLs }),
        tooltipLabel: `Import your website's sitemap URL to automatically fetch and organize the URLs of your website's pages.`,
        onTooltipLearnClick: () => openInternalURLInANewTab(Documentation.KB_DATA_SOURCES),
      },
    ],
    []
  );

  const modifiers = usePopperModifiers([{ name: 'preventOverflow', options: { padding: 8 } }]);

  return (
    <Popper
      modifiers={modifiers}
      referenceElement={({ ref, popper, isOpen, onOpen }) => (
        <Button ref={ref} variant={buttonVariant} label="Add data source" isActive={isOpen} onClick={() => onOpen()}>
          {popper}
        </Button>
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
