import { Menu, MenuItem, Popper, PrimaryNavigation } from '@voiceflow/ui-next';
import React from 'react';

import { BOOK_DEMO_LINK, DISCORD_COMMUNITY_LINK, DOCS_LINK, YOUTUBE_CHANNEL_LINK } from '@/constants/link.constant';
import { VoiceflowAssistantVisibilityContext } from '@/contexts/VoiceflowAssistantVisibility';
import { useTrackingEvents } from '@/hooks/tracking';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

export const AssistantMenuHelpItem: React.FC = () => {
  const [, trackingEventsWrapper] = useTrackingEvents();

  const voiceflowAssistantVisibility = React.useContext(VoiceflowAssistantVisibilityContext);

  return (
    <Popper
      placement="right-end"
      referenceElement={({ ref, isOpen, onOpen }) => (
        <div ref={ref}>
          <PrimaryNavigation.Item isActive={isOpen} onClick={onOpen} iconName="Info" />
        </div>
      )}
    >
      {() => (
        <Menu>
          <MenuItem
            label="Documentation"
            onClick={trackingEventsWrapper(onOpenInternalURLInANewTabFactory(DOCS_LINK), 'trackCanvasControlHelpMenuResource', { resource: 'Docs' })}
          />

          <MenuItem
            label="Video tutorials"
            onClick={trackingEventsWrapper(onOpenInternalURLInANewTabFactory(YOUTUBE_CHANNEL_LINK), 'trackCanvasControlHelpMenuResource', {
              resource: 'Videos',
            })}
          />

          <MenuItem
            label="Community"
            onClick={trackingEventsWrapper(onOpenInternalURLInANewTabFactory(DISCORD_COMMUNITY_LINK), 'trackCanvasControlHelpMenuResource', {
              resource: 'Forum',
            })}
          />

          <MenuItem
            label={voiceflowAssistantVisibility?.isEnabled ? 'Hide chatbot' : 'Show chatbot'}
            onClick={() => voiceflowAssistantVisibility?.onToggleEnabled()}
          />

          <MenuItem
            label="Book a demo"
            onClick={trackingEventsWrapper(onOpenInternalURLInANewTabFactory(BOOK_DEMO_LINK), 'trackCanvasControlHelpMenuResource', {
              resource: 'Demo',
            })}
          />
        </Menu>
      )}
    </Popper>
  );
};
