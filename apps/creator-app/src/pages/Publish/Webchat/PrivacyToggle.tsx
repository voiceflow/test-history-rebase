import { BaseModels } from '@voiceflow/base-types';
import { Box, Portal } from '@voiceflow/ui';
import { Toggle, Tooltip, useTooltipModifiers } from '@voiceflow/ui-next';
import React, { useLayoutEffect } from 'react';

import * as ProjectV2 from '@/ducks/projectV2';
import { useDispatch, useSelector, useTrackingEvents } from '@/hooks';

const PrivacyToggle: React.FC = () => {
  const project = useSelector(ProjectV2.active.projectSelector)!;
  const projectID = useSelector(ProjectV2.active.idSelector)!;
  const updateProject = useDispatch(ProjectV2.updateProjectAPIPrivacy);

  // eslint-disable-next-line no-empty-function
  const forceUpdateRef = React.useRef<VoidFunction>(() => {});

  const modifiers = useTooltipModifiers([{ name: 'offset', options: { offset: [0, 18] } }]);

  const [trackingEvents] = useTrackingEvents();

  const isPublic = project.apiPrivacy === BaseModels.Project.Privacy.PUBLIC;

  const toggleProject = React.useCallback(() => {
    const status = isPublic ? BaseModels.Project.Privacy.PRIVATE : BaseModels.Project.Privacy.PUBLIC;
    updateProject(projectID, status);

    trackingEvents.trackWebchatStatusChanged({ status });
  }, [isPublic]);

  useLayoutEffect(() => {
    forceUpdateRef.current();
  }, [isPublic]);

  return (
    <Portal portalNode={document.body}>
      <Box position="fixed" top={20} right={12}>
        <Tooltip
          variant="dark"
          modifiers={modifiers}
          placement="bottom-end"
          onPreventClose={(event) =>
            (event?.type === 'click' &&
              event.target instanceof HTMLElement &&
              !!event.target.closest('[data-tooltip-prevent-close]')) ||
            false
          }
          referenceElement={({ ref, onOpen, onClose }) => (
            <Box ref={ref} onMouseEnter={onOpen} onMouseLeave={onClose} data-tooltip-prevent-close>
              <Toggle value={isPublic} onValueChange={toggleProject} />
            </Box>
          )}
        >
          {({ forceUpdate }) => {
            forceUpdateRef.current = forceUpdate;

            return (
              <Tooltip.Caption mb={0}>
                {isPublic
                  ? 'Widget enabled and visible to website visitors'
                  : 'Widget disabled and hidden from website visitors'}
              </Tooltip.Caption>
            );
          }}
        </Tooltip>
      </Box>
    </Portal>
  );
};

export default PrivacyToggle;
