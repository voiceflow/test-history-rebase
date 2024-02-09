import { tid } from '@voiceflow/style';
import { BaseProps, Menu, Popper, PrimaryNavigation } from '@voiceflow/ui-next';
import React from 'react';

import { BOOK_DEMO_LINK, DISCORD_COMMUNITY_LINK, DOCS_LINK, YOUTUBE_CHANNEL_LINK } from '@/constants/link.constant';
import { VoiceflowAssistantVisibilityContext } from '@/contexts/VoiceflowAssistantVisibility';
import { useTrackingEvents } from '@/hooks/tracking';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

export const AssistantNavigationHelpItem: React.FC<BaseProps> = ({ testID }) => {
  const [, trackingEventsWrapper] = useTrackingEvents();

  const voiceflowAssistantVisibility = React.useContext(VoiceflowAssistantVisibilityContext);

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
      {() => (
        <Menu>
          <Menu.Item
            label="Documentation"
            onClick={trackingEventsWrapper(onOpenInternalURLInANewTabFactory(DOCS_LINK), 'trackCanvasControlHelpMenuResource', { resource: 'Docs' })}
            testID={tid(testID, 'menu-item', 'documentation')}
          />

          <Menu.Item
            label="Video tutorials"
            onClick={trackingEventsWrapper(onOpenInternalURLInANewTabFactory(YOUTUBE_CHANNEL_LINK), 'trackCanvasControlHelpMenuResource', {
              resource: 'Videos',
            })}
            testID={tid(testID, 'menu-item', 'tutorials')}
          />

          <Menu.Item
            label="Community"
            onClick={trackingEventsWrapper(onOpenInternalURLInANewTabFactory(DISCORD_COMMUNITY_LINK), 'trackCanvasControlHelpMenuResource', {
              resource: 'Forum',
            })}
            testID={tid(testID, 'menu-item', 'community')}
          />

          <Menu.Item
            label={voiceflowAssistantVisibility?.isEnabled ? 'Hide chatbot' : 'Show chatbot'}
            onClick={() => voiceflowAssistantVisibility?.onToggleEnabled()}
            testID={tid(testID, 'menu-item', 'toggle-chatbot')}
          />

          <Menu.Item
            label="Book a demo"
            onClick={trackingEventsWrapper(onOpenInternalURLInANewTabFactory(BOOK_DEMO_LINK), 'trackCanvasControlHelpMenuResource', {
              resource: 'Demo',
            })}
            testID={tid(testID, 'menu-item', 'book-demo')}
          />
        </Menu>
      )}
    </Popper>
  );
};
