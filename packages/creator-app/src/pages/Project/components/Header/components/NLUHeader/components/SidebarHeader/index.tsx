import { Utils } from '@voiceflow/common';
import { Box, Popper, SvgIcon } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import * as NLU from '@/config/nlu';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { useTrackingEvents } from '@/hooks';
import { useNLUManager } from '@/pages/NLUManager/context';
import { isVoiceflowPlatform } from '@/utils/typeGuards';

import { ErrorBubble, SidebarHeaderContainer } from './components';
import NLUNotifications from './components/NLUNotifications';

const SidebarHeader: React.FC = () => {
  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const project = useSelector(ProjectV2.getProjectByIDSelector)({ id: projectID });
  const { notifications } = useNLUManager();
  const [trackingEvents] = useTrackingEvents();

  const showIcon = !isVoiceflowPlatform(project?.platform);
  const nluConfig = NLU.Config.get(project?.platform);

  return (
    <SidebarHeaderContainer>
      <Box display="flex" alignItems="center">
        {showIcon && (
          <Box display="inline-block" mr={12}>
            <SvgIcon size={16} color={nluConfig.icon.color} icon={nluConfig.icon.name} />
          </Box>
        )}
        NLU Model
      </Box>

      {notifications.length > 0 && (
        <Popper width="400px" placement="bottom-start" renderContent={({ onClose }) => <NLUNotifications onClose={onClose} />}>
          {({ ref, onToggle, isOpened }) => (
            <ErrorBubble
              ref={ref}
              active={isOpened}
              onClick={Utils.functional.chainVoid(onToggle, () => !isOpened && trackingEvents.trackNLUNotificationsOpened())}
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
