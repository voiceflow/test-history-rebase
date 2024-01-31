import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, Menu, Popper } from '@voiceflow/ui-next';
import React from 'react';

import { MenuItemWithTooltip } from '@/components/Menu/MenuItemWithTooltip/MenuItemWithTooltip.component';
import { TooltipContentLearn } from '@/components/Tooltip/TooltipContentLearn/TooltipContentLearn.component';
import { CMS_KNOWLEDGE_BASE_LEARN_MORE } from '@/constants/link.constant';
import { useFeature } from '@/hooks';
import { useModal } from '@/hooks/modal.hook';
import { usePopperModifiers } from '@/hooks/popper.hook';
import { Modals } from '@/ModalsV2';
import { stopPropagation } from '@/utils/handler.util';
import { openInternalURLInANewTab } from '@/utils/window';

import { ICMSKnowledgeBaseAddDataSourceButton } from './CMSKnowledgeBaseAddDataSourceButton.interface';

export const CMSKnowledgeBaseAddDataSourceButton: React.FC<ICMSKnowledgeBaseAddDataSourceButton> = ({ variant = 'primary', testID }) => {
  const urlsModal = useModal(Modals.KnowledgeBase.Import.Url);
  const filesModal = useModal(Modals.KnowledgeBase.Import.File);
  const sitemapModal = useModal(Modals.KnowledgeBase.Import.Sitemap);
  const plainTextModal = useModal(Modals.KnowledgeBase.Import.PlainText);
  const integrationModal = useModal(Modals.KnowledgeBase.Import.Integration);

  const { isEnabled: isIntegrationsEnabled } = useFeature(Realtime.FeatureFlag.KNOWLEDGE_BASE_INTEGRATIONS);

  const options = [
    {
      label: 'Plain text',
      onClick: () => plainTextModal.openVoid(),
      tooltipLabel: 'Copy and paste, or manually add text directly into your knowledge base.',
      onTooltipLearnClick: () => openInternalURLInANewTab(CMS_KNOWLEDGE_BASE_LEARN_MORE),
    },
    {
      label: 'Upload file',
      onClick: () => filesModal.openVoid(),
      tooltipLabel: 'Supported file formats: .pdf, .txt, .docx. Max file size: 10mb.',
      onTooltipLearnClick: () => openInternalURLInANewTab(CMS_KNOWLEDGE_BASE_LEARN_MORE),
    },
    {
      label: 'URL(s)',
      onClick: () => urlsModal.openVoid(),
      tooltipLabel: 'Import web page content from public URLs directly into your knowledge base.',
      onTooltipLearnClick: () => openInternalURLInANewTab(CMS_KNOWLEDGE_BASE_LEARN_MORE),
    },
    {
      label: 'Sitemap',
      onClick: () => sitemapModal.openVoid(),
      tooltipLabel: `Import your website's sitemap URL to automatically fetch and organize the URLs of your website's pages.`,
      onTooltipLearnClick: () => openInternalURLInANewTab(CMS_KNOWLEDGE_BASE_LEARN_MORE),
    },
    {
      label: 'Integration',
      onClick: () => integrationModal.openVoid(),
      tooltipLabel: `Connect and import data from external platforms like Zendesk.`,
      onTooltipLearnClick: () => openInternalURLInANewTab(CMS_KNOWLEDGE_BASE_LEARN_MORE),
      shouldRender: () => isIntegrationsEnabled,
    },
  ];

  const modifiers = usePopperModifiers([{ name: 'preventOverflow', options: { padding: 8 } }]);

  return (
    <Popper
      modifiers={modifiers}
      referenceElement={({ ref, popper, isOpen, onOpen }) => (
        <Button ref={ref} variant={variant} label="Add data source" isActive={isOpen} onClick={() => onOpen()} testID={testID}>
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
              >
                {() => (
                  <TooltipContentLearn label={option.tooltipLabel} onLearnClick={() => option.onTooltipLearnClick && option?.onTooltipLearnClick()} />
                )}
              </MenuItemWithTooltip>
            ))}
        </Menu>
      )}
    </Popper>
  );
};
