import { BaseModels } from '@voiceflow/base-types';
import { Box, Portal, TippyTooltip, Toggle } from '@voiceflow/ui';
import React, { useEffect } from 'react';

import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import { useDispatch, useSelector, useTrackingEvents } from '@/hooks';

const PrivacyToggle: React.FC = () => {
  const projectID = useSelector(ProjectV2.active.idSelector)!;
  const project = useSelector(ProjectV2.active.projectSelector)!;
  const updateProject = useDispatch(Project.updateProjectAPIPrivacy);

  const [trackingEvents] = useTrackingEvents();

  const isPublic = project.apiPrivacy === BaseModels.Project.Privacy.PUBLIC;

  const toggleProject = React.useCallback(() => {
    const status = isPublic ? BaseModels.Project.Privacy.PRIVATE : BaseModels.Project.Privacy.PUBLIC;
    updateProject(projectID, status);

    trackingEvents.trackWebchatStatusChanged({ status });
  }, [isPublic]);

  // toggle privacy on by default when visiting the page
  // this is a compromise on security vs UX, if this page is never accessed, the project will remain private
  useEffect(() => {
    if (!isPublic) updateProject(projectID, BaseModels.Project.Privacy.PUBLIC);
  }, []);

  return (
    <Portal portalNode={document.body}>
      <Box position="fixed" top={22} right={32}>
        <TippyTooltip
          content={isPublic ? 'Widget enabled and visible to website visitors' : 'Widget disabled and hidden from website visitors'}
          position="bottom"
          hideOnClick={false}
        >
          <Toggle checked={isPublic} onChange={toggleProject} size={Toggle.Size.EXTRA_SMALL} />
        </TippyTooltip>
      </Box>
    </Portal>
  );
};

export default PrivacyToggle;
