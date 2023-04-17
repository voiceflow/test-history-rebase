import { Box, SvgIcon } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import * as NLU from '@/config/nlu';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { isVoiceflowNluModel } from '@/utils/typeGuards';

import { SidebarHeaderContainer } from './components';

const SidebarHeader: React.FC = () => {
  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const project = useSelector(ProjectV2.getProjectByIDSelector)({ id: projectID });

  const showIcon = !isVoiceflowNluModel(project?.nlu);
  const nluConfig = NLU.Config.get(project?.nlu);

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

      {/* TO DO: Removed from NLU v1. Add it back in NLU v2 */}
      {/* {notifications.length > 0 && (
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
      )} */}
    </SidebarHeaderContainer>
  );
};

export default SidebarHeader;
