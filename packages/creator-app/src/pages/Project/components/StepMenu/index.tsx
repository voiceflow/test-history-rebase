import * as Realtime from '@voiceflow/realtime-sdk';
import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import * as ProjectV2 from '@/ducks/projectV2';
import { useFeature, usePermission, useSelector, useToggle } from '@/hooks';
import { Identifier } from '@/styles/constants';

import { StepMenuExpandButton, TopLevelButton, TopLevelInnerContainer, TopLevelOuterContainer } from './components';
import { getAllSections } from './constants';

const StepMenu: React.FC<{ numCollapsedSteps?: number }> = ({ numCollapsedSteps = 3 }) => {
  const blockTemplates = useFeature(Realtime.FeatureFlag.BLOCK_TEMPLATE);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const projectType = useSelector(ProjectV2.active.projectTypeSelector);
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const [isExpanded, toggleIsExpanded] = useToggle(true);

  const steps = getAllSections(platform, projectType).filter((step) => {
    if (step.isLibrary && !blockTemplates.isEnabled) return false;
    return true;
  });

  const stepsToShow = isExpanded ? steps : steps.slice(0, numCollapsedSteps);

  return (
    <>
      {canEditCanvas && (
        <TopLevelOuterContainer id={Identifier.STEP_MENU}>
          <TopLevelInnerContainer size={stepsToShow.length}>
            {stepsToShow.map((step, index) => (
              <TopLevelButton key={step.label} step={step} animationIndex={Math.max(0, index - numCollapsedSteps)} />
            ))}
          </TopLevelInnerContainer>

          <StepMenuExpandButton onClick={toggleIsExpanded}>
            <SvgIcon icon="arrowToggleV2" size={20} color="#6e849a" inline rotation={isExpanded ? 270 : 90} />
          </StepMenuExpandButton>
        </TopLevelOuterContainer>
      )}
    </>
  );
};

export default StepMenu;
