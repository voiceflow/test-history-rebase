import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import * as ProjectV2 from '@/ducks/projectV2';
import { useHover, usePermission, useSelector, useToggle } from '@/hooks';

import { StepMenuExpandButton, TopLevelButton, TopLevelInnerContainer, TopLevelOuterContainer } from './components';
import { getStepSections } from './constants';

const StepMenu: React.FC<{ numCollapsedSteps?: number }> = ({ numCollapsedSteps = 3 }) => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const projectType = useSelector(ProjectV2.active.projectTypeSelector);
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const [isExpanded, toggleIsExpanded] = useToggle(false);

  const steps = getStepSections(platform, projectType);

  const [isHovered, , hoverHandlers] = useHover();
  const shouldShowAllStepButtons = isExpanded || numCollapsedSteps >= steps.length;

  return (
    <>
      {canEditCanvas && (
        <TopLevelOuterContainer {...hoverHandlers} isHovered={isHovered}>
          <TopLevelInnerContainer>
            {steps.map((step, index) => (
              <TopLevelButton key={step.label} step={step} isVisible={shouldShowAllStepButtons || index < numCollapsedSteps} />
            ))}
          </TopLevelInnerContainer>
          <StepMenuExpandButton onClick={toggleIsExpanded} isHovered={isHovered}>
            <SvgIcon icon="arrowToggleV2" size={16} color="#393e42" inline rotation={isExpanded ? 270 : 90} />
          </StepMenuExpandButton>
        </TopLevelOuterContainer>
      )}
    </>
  );
};

export default StepMenu;
