import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import { usePermission, useToggle } from '@/hooks';

import { StepMenuExpandButton, TopLevelButton, TopLevelInnerContainer, TopLevelOuterContainer } from './components';
import { STEPS } from './constants';

const StepMenu: React.FC<{ numCollapsedSteps?: number }> = ({ numCollapsedSteps = 3 }) => {
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const [isExpanded, toggleIsExpanded] = useToggle(false);

  const shouldShowAllStepButtons = isExpanded || numCollapsedSteps >= STEPS.length;

  const minSteps = React.useMemo(() => STEPS.slice(0, numCollapsedSteps), [numCollapsedSteps]);

  return (
    <>
      {canEditCanvas && (
        <TopLevelOuterContainer>
          <TopLevelInnerContainer>
            {!shouldShowAllStepButtons && minSteps.map((step) => <TopLevelButton key={step.name} step={step} />)}
            {shouldShowAllStepButtons && STEPS.map((step) => <TopLevelButton key={step.name} step={step} />)}
          </TopLevelInnerContainer>
          <StepMenuExpandButton onClick={toggleIsExpanded}>
            <SvgIcon icon="arrowToggle" height={4} width={6} color="#393e42" inline rotation={isExpanded ? 0 : 180} />
          </StepMenuExpandButton>
        </TopLevelOuterContainer>
      )}
    </>
  );
};

export default StepMenu;
