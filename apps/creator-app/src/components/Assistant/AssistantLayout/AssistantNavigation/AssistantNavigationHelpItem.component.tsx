import { Utils } from '@voiceflow/common';
import type { IconName } from '@voiceflow/icons';
import { tid } from '@voiceflow/style';
import type { BaseProps } from '@voiceflow/ui-next';
import { HotKeys, Menu, Popper, PrimaryNavigation } from '@voiceflow/ui-next';
import React from 'react';

import {
  API_LEARN_LINK,
  BOOK_DEMO_LINK,
  CHANGELOG_LINK,
  DISCORD_LINK,
  LEARN_LINK,
  STATUS_LINK,
  YOUTUBE_CHANNEL_LINK,
} from '@/constants/link.constant';
import { VoiceflowAssistantVisibilityContext } from '@/contexts/VoiceflowAssistantVisibility';
import { useTrackingEvents } from '@/hooks/tracking';
import { getHotkeys, Hotkey } from '@/keymap';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

export const AssistantNavigationHelpItem: React.FC<BaseProps> = ({ testID }) => {
  const [trackingEvents] = useTrackingEvents();

  const voiceflowAssistantVisibility = React.useContext(VoiceflowAssistantVisibilityContext);

  const renderLinkItem = ({
    id,
    link,
    label,
    onClose,
    resource,
    iconName,
  }: {
    id: string;
    link: string;
    label: string;
    onClose: VoidFunction;
    resource: string;
    iconName: IconName;
  }) => (
    <Menu.Item
      label={label}
      onClick={Utils.functional.chainVoid(onClose, onOpenInternalURLInANewTabFactory(link), () =>
        trackingEvents.trackCanvasControlHelpMenuResource({ resource })
      )}
      testID={tid(testID, 'menu-item', id)}
      prefixIconName={iconName}
      suffixIconName="ArrowUpRight"
    />
  );

  return (
    <Popper
      placement="right-end"
      testID={tid(testID, 'menu')}
      referenceElement={({ ref, isOpen, onOpen }) => (
        <div ref={ref}>
          <PrimaryNavigation.Item isActive={isOpen} onClick={onOpen} iconName="Info" testID={testID} />
        </div>
      )}
    >
      {({ onClose }) => (
        <Menu maxHeight={410}>
          <Menu.Divider label="What’s new" fullWidth={false} />

          {renderLinkItem({
            id: 'change-log',
            label: 'Changelog',
            link: CHANGELOG_LINK,
            onClose,
            resource: 'Changelog',
            iconName: 'New',
          })}

          <Menu.Divider label="Help" fullWidth={false} />

          {renderLinkItem({
            id: 'documentation',
            label: 'Documentation',
            link: LEARN_LINK,
            onClose,
            resource: 'Docs',
            iconName: 'Documentation',
          })}

          {renderLinkItem({
            id: 'api-documentation',
            label: 'API documentation',
            link: API_LEARN_LINK,
            onClose,
            resource: 'API Docs',
            iconName: 'ApiDocumenation',
          })}

          {renderLinkItem({
            id: 'tutorials',
            link: YOUTUBE_CHANNEL_LINK,
            label: 'Video tutorials',
            onClose,
            resource: 'Videos',
            iconName: 'Video',
          })}

          {renderLinkItem({
            id: 'book-demo',
            link: BOOK_DEMO_LINK,
            label: 'Book a demo',
            onClose,
            resource: 'Demo',
            iconName: 'AgentS',
          })}

          <Menu.Divider label="Other" fullWidth={false} />

          {renderLinkItem({
            id: 'community',
            link: DISCORD_LINK,
            label: 'Discord community',
            onClose,
            resource: 'Forum',
            iconName: 'Discord',
          })}

          {renderLinkItem({
            id: 'status',
            link: STATUS_LINK,
            label: 'Status updates',
            onClose,
            resource: 'Status',
            iconName: 'Status',
          })}

          <Menu.Item
            label={voiceflowAssistantVisibility?.isEnabled ? 'Hide chatbot' : 'Show chatbot'}
            testID={tid(testID, 'menu-item', 'toggle-chatbot')}
            onClick={() => voiceflowAssistantVisibility?.onToggleEnabled()}
            hotKeys={<HotKeys hotKeys={getHotkeys(Hotkey.TOGGLE_CHATBOT)} />}
            prefixIconName="IconSmallContactUs"
          />
        </Menu>
      )}
    </Popper>
  );
};
