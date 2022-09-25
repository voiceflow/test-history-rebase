import { SvgIcon, useLocalStorageState } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import * as CanvasTemplates from '@/ducks/canvasTemplate';
import * as CustomBlocks from '@/ducks/customBlock';
import * as ProjectV2 from '@/ducks/projectV2';
import { usePermission, useSelector } from '@/hooks';
import { Identifier } from '@/styles/constants';

import { getAllSections, LibraryStepType } from './constants';
import * as S from './styles';
import TopLevelButton from './TopLevelButton';

const STEP_MENU_EXPANDED_LOCAL_STORAGE_KEY = 'stepMenuExpanded';

const StepMenu: React.FC<{ numCollapsedSteps?: number }> = ({ numCollapsedSteps = 3 }) => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const projectType = useSelector(ProjectV2.active.projectTypeSelector);
  const [isExpanded, toggleIsExpanded] = useLocalStorageState(STEP_MENU_EXPANDED_LOCAL_STORAGE_KEY, false);
  const templates = useSelector(CanvasTemplates.allCanvasTemplatesSelector);
  const customBlocks = useSelector(CustomBlocks.allCustomBlocksSelector);

  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);

  const sections = getAllSections(platform, projectType, {
    [LibraryStepType.BLOCK_TEMPLATES]: templates,
    [LibraryStepType.CUSTOM_BLOCK]: customBlocks,
  });

  const sectionsToShow = isExpanded ? sections : sections.slice(0, numCollapsedSteps);

  return (
    <>
      {canEditCanvas && (
        <S.TopLevelOuterContainer id={Identifier.STEP_MENU}>
          <S.TopLevelInnerContainer size={sectionsToShow.length}>
            {sectionsToShow.map((section, index) => (
              <TopLevelButton key={section.label} section={section} animationIndex={Math.max(0, index - numCollapsedSteps)} />
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
