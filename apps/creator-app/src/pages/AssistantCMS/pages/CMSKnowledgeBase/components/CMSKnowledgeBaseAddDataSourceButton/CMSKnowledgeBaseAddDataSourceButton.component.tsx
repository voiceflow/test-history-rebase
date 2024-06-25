import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { tid } from '@voiceflow/style';
import { Button, Menu, Popper } from '@voiceflow/ui-next';
import React from 'react';

import { MenuItemWithTooltip } from '@/components/Menu/MenuItemWithTooltip/MenuItemWithTooltip.component';
import { TooltipContentLearn } from '@/components/Tooltip/TooltipContentLearn/TooltipContentLearn.component';
import { CMS_KNOWLEDGE_BASE_LEARN_MORE } from '@/constants/link.constant';
import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks';
import { useFeature } from '@/hooks/feature.hook';
import { useModal } from '@/hooks/modal.hook';
import { usePopperModifiers } from '@/hooks/popper.hook';
import { useTimer } from '@/hooks/timer.hook';
import { Modals } from '@/ModalsV2';
import { stopPropagation } from '@/utils/handler.util';
import { openInternalURLInANewTab } from '@/utils/window';

import type { ICMSKnowledgeBaseAddDataSourceButton } from './CMSKnowledgeBaseAddDataSourceButton.interface';

export const CMSKnowledgeBaseAddDataSourceButton: React.FC<ICMSKnowledgeBaseAddDataSourceButton> = ({
  variant = 'primary',
  testID,
}) => {
  const getAll = useDispatch(Designer.KnowledgeBase.Document.effect.getAll);

  const docsCount = useSelector(Designer.KnowledgeBase.Document.selectors.count);

  const urlsModal = useModal(Modals.KnowledgeBase.Import.Url);
  const filesModal = useModal(Modals.KnowledgeBase.Import.File);
  const sitemapModal = useModal(Modals.KnowledgeBase.Import.Sitemap);
  const plainTextModal = useModal(Modals.KnowledgeBase.Import.PlainText);
  const integrationModal = useModal(Modals.KnowledgeBase.Import.Integration);

  const isIntegrationsEnabled = useFeature(Realtime.FeatureFlag.KNOWLEDGE_BASE_INTEGRATIONS);

  const checkForInitialDocumentsTimer = useTimer(
    async ({ state, unmounted }) => {
      let shouldStop = false;

      try {
        const result = await getAll();

        shouldStop = result.length !== docsCount;
      } catch {
        // ignore
      } finally {
        if (!shouldStop && state.count < 5 && !unmounted) {
          checkForInitialDocumentsTimer.start(5000);
        }

        // eslint-disable-next-line no-param-reassign
        state.count += 1;
      }
    },
    { count: 0 }
  );

  const options = [
    {
      label: 'Plain text',
      onClick: () => plainTextModal.openVoid(),
      tooltipLabel: 'Copy and paste, or manually add text directly into your knowledge base.',
      onTooltipLearnClick: () => openInternalURLInANewTab(CMS_KNOWLEDGE_BASE_LEARN_MORE),
      testID: 'plain-text',
    },
    {
      label: 'Upload file',
      onClick: () => filesModal.openVoid(),
      tooltipLabel: 'Supported file formats: .pdf, .txt, .docx. Max file size: 10mb.',
      onTooltipLearnClick: () => openInternalURLInANewTab(CMS_KNOWLEDGE_BASE_LEARN_MORE),
      testID: 'upload-file',
    },
    {
      label: 'URL(s)',
      onClick: () => urlsModal.openVoid(),
      tooltipLabel: 'Import web page content from public URLs directly into your knowledge base.',
      onTooltipLearnClick: () => openInternalURLInANewTab(CMS_KNOWLEDGE_BASE_LEARN_MORE),
      testID: 'url',
    },
    {
      label: 'Sitemap',
      onClick: () => sitemapModal.openVoid(),
      tooltipLabel:
        "Import your website's sitemap URL to automatically fetch and organize the URLs of your website's pages.",
      onTooltipLearnClick: () => openInternalURLInANewTab(CMS_KNOWLEDGE_BASE_LEARN_MORE),
      testID: 'sitemap',
    },
    {
      label: 'Integration',
      onClick: async () => {
        try {
          await integrationModal.open();

          checkForInitialDocumentsTimer.resetState();
          checkForInitialDocumentsTimer.start(3000);
        } catch {
          // closed
        }
      },
      tooltipLabel: 'Connect and import data from external platforms like Zendesk.',
      onTooltipLearnClick: () => openInternalURLInANewTab(CMS_KNOWLEDGE_BASE_LEARN_MORE),
      shouldRender: () => isIntegrationsEnabled,
      testID: 'integration',
    },
  ];

  const modifiers = usePopperModifiers([{ name: 'preventOverflow', options: { padding: 8 } }]);

  return (
    <Popper
      modifiers={modifiers}
      testID={tid(testID, 'menu')}
      referenceElement={({ ref, popper, isOpen, onOpen }) => (
        <Button
          ref={ref}
          variant={variant}
          label="Add data source"
          isActive={isOpen}
          onClick={() => onOpen()}
          testID={testID}
        >
          {popper}
        </Button>
      )}
    >
      {({ onClose, referenceRef }) => (
        <Menu minWidth={referenceRef.current?.clientWidth}>
          {options
            .filter((option) => !option.shouldRender || option.shouldRender())
            .map((option) => (
              <MenuItemWithTooltip
                key={option.label}
                label={option.label}
                tooltip={{ width: 200 }}
                onClick={stopPropagation(Utils.functional.chain(option.onClick, onClose))}
                testID={tid(testID, 'menu-item', option.testID)}
              >
                {() => (
                  <TooltipContentLearn
                    label={option.tooltipLabel}
                    onLearnClick={() => option.onTooltipLearnClick && option?.onTooltipLearnClick()}
                  />
                )}
              </MenuItemWithTooltip>
            ))}
        </Menu>
      )}
    </Popper>
  );
};
