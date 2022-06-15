import { Box, Popper, SvgIcon } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { PLATFORM_PROJECT_META_MAP } from '@/pages/NewProjectV2/constants';
import { SupportedPlatformProjectType } from '@/pages/NewProjectV2/types';
import { isVoiceflowPlatform } from '@/utils/typeGuards';

import { ErrorBubble, SidebarHeaderContainer } from './components';
import NLUNotifications from './components/NLUNotifications';

const SidebarHeader: React.FC = () => {
  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const project = useSelector(ProjectV2.getProjectByIDSelector)({ id: projectID });
  const platform = project?.platform;
  const platformMeta = PLATFORM_PROJECT_META_MAP[platform as SupportedPlatformProjectType];
  const showIcon = !isVoiceflowPlatform(platform);

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

      <Popper width="370px" placement="bottom-start" renderContent={() => <NLUNotifications />}>
        {({ ref, onToggle, isOpened }) => (
          <ErrorBubble active={isOpened} onClick={onToggle} ref={ref}>
            <SvgIcon mr={5} color={isOpened ? '#132144' : '#6e849a'} icon="warning" inline size={16} />2
          </ErrorBubble>
        )}
      </Popper>
    </SidebarHeaderContainer>
  );
};

export default SidebarHeader;
