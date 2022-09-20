import { Box, Popper, SvgIcon } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { useTrackingEvents } from '@/hooks';
import { PLATFORM_PROJECT_META_MAP } from '@/pages/NewProjectV2/constants';
import { SupportedPlatformProjectType } from '@/pages/NewProjectV2/types';
import { useNLUManager } from '@/pages/NLUManager/context';
import { isVoiceflowPlatform } from '@/utils/typeGuards';

import { ErrorBubble, SidebarHeaderContainer } from './components';
import NLUNotifications from './components/NLUNotifications';

const SidebarHeader: React.FC = () => {
  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const project = useSelector(ProjectV2.getProjectByIDSelector)({ id: projectID });
  const platform = project?.platform;
  const platformMeta = PLATFORM_PROJECT_META_MAP[platform as SupportedPlatformProjectType];
  const showIcon = !isVoiceflowPlatform(platform);
  const { notifications } = useNLUManager();
  const [trackingEvents] = useTrackingEvents();

  return (
    <SidebarHeaderContainer>
      <Box display="flex" alignItems="center">
        {showIcon && !!platformMeta?.icon && (
          <Box display="inline-block" mr={12}>
            <SvgIcon size={16} color={platformMeta?.iconColor} icon={platformMeta.icon} />
          </Box>
        )}
        NLU Model
      </Box>

      {notifications.length > 0 && (
        <Popper width="400px" placement="bottom-start" renderContent={({ onClose }) => <NLUNotifications onClose={onClose} />}>
          {({ ref, onToggle, isOpened }) => (
            <ErrorBubble
              active={isOpened}
              onClick={() => {
                onToggle();
                if (!isOpened) {
                  trackingEvents.trackNLUNotificationsOpened();
                }
              }}
              ref={ref}
            >
              <SvgIcon mr={6} mt={1} color={isOpened ? '#132144' : '#6e849a'} icon="warning" inline size={16} />
              {notifications.length}
            </ErrorBubble>
          )}
        </Popper>
      )}
    </SidebarHeaderContainer>
  );
};

export default SidebarHeader;
