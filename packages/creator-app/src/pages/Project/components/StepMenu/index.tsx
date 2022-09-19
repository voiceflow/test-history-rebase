import { SvgIcon, useLocalStorageState } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import * as CanvasTemplates from '@/ducks/canvasTemplate';
import * as ProjectV2 from '@/ducks/projectV2';
import { usePermission, useSelector } from '@/hooks';
import { Identifier } from '@/styles/constants';

import { getAllSections } from './constants';
import * as S from './styles';
import TopLevelButton from './TopLevelButton';

const STEP_MENU_EXPANDED_LOCAL_STORAGE_KEY = 'stepMenuExpanded';

const StepMenu: React.FC<{ numCollapsedSteps?: number }> = ({ numCollapsedSteps = 3 }) => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const projectType = useSelector(ProjectV2.active.projectTypeSelector);
  const [isExpanded, toggleIsExpanded] = useLocalStorageState(STEP_MENU_EXPANDED_LOCAL_STORAGE_KEY, false);

  const templates = useSelector(CanvasTemplates.allCanvasTemplatesSelector);
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);

  const steps = getAllSections(platform, projectType, templates);

  const stepsToShow = isExpanded ? steps : steps.slice(0, numCollapsedSteps);

  return (
    <>
      {canEditCanvas && (
        <S.TopLevelOuterContainer id={Identifier.STEP_MENU}>
          <S.TopLevelInnerContainer size={stepsToShow.length}>
            {stepsToShow.map((step, index) => (
              <TopLevelButton key={step.label} step={step} animationIndex={Math.max(0, index - numCollapsedSteps)} />
            ))}
          </S.TopLevelInnerContainer>

          <S.StepMenuExpandButton onClick={() => toggleIsExpanded(!isExpanded)}>
            <SvgIcon icon="arrowToggleV2" size={20} color="#6e849a" inline rotation={isExpanded ? 270 : 90} />
          </S.StepMenuExpandButton>
        </S.TopLevelOuterContainer>
      )}
    </>
  );
};

export default StepMenu;
