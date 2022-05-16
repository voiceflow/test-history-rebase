import { Box, SvgIcon } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import { HeaderNavLinkSidebarTitle } from '@/components/ProjectPage';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { PLATFORM_PROJECT_META_MAP } from '@/pages/NewProjectV2/constants';
import { SupportedPlatformProjectType } from '@/pages/NewProjectV2/types';

import { ErrorBubble } from './components';

const SidebarHeader: React.FC = () => {
  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const project = useSelector(ProjectV2.getProjectByIDSelector)({ id: projectID });
  const platformMeta = PLATFORM_PROJECT_META_MAP[project?.platform as SupportedPlatformProjectType];

  return (
    <HeaderNavLinkSidebarTitle>
      <Box display="flex" alignItems="center">
        <Box display="inline-block" mr={8}>
          {platformMeta?.icon && <SvgIcon size={16} color={platformMeta?.iconColor} icon={platformMeta.icon} />}
        </Box>
        NLU Model
      </Box>
      <ErrorBubble>
        <SvgIcon mr={5} icon="warning" inline size={14} />2
      </ErrorBubble>
    </HeaderNavLinkSidebarTitle>
  );
};

export default SidebarHeader;
