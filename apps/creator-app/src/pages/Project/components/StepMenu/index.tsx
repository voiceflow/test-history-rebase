import { SvgIcon, useLocalStorageState } from '@voiceflow/ui';
import React from 'react';

import { useProjectAIPlayground } from '@/components/GPT/hooks';
import { Permission } from '@/constants/permissions';
import * as CanvasTemplates from '@/ducks/canvasTemplate';
import * as CustomBlocks from '@/ducks/customBlock';
import * as ProjectV2 from '@/ducks/projectV2';
import { usePermission, useSelector } from '@/hooks';
import { Identifier } from '@/styles/constants';

import { AI_LABEL, EVENT_LABEL, getAllSections, LibraryStepType, TopLibraryItem, TopStepItem } from './constants';
import * as S from './styles';
import TopLevelButton from './TopLevelButton';

const STEP_MENU_EXPANDED_LOCAL_STORAGE_KEY = 'stepMenuExpanded';

const StepMenu: React.FC = () => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const projectType = useSelector(ProjectV2.active.projectTypeSelector);
  const aiPlaygroundEnabled = useProjectAIPlayground();
  const [isExpanded, toggleIsExpanded] = useLocalStorageState(STEP_MENU_EXPANDED_LOCAL_STORAGE_KEY, true);
  const templates = useSelector(CanvasTemplates.allCanvasTemplatesSelector);
  const customBlocks = useSelector(CustomBlocks.allCustomBlocksSelector);

  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);

  const [eventSection, otherSections, numCollapsedSteps] = React.useMemo(() => {
    let numCollapsedSteps = 5;
    let sections = getAllSections(platform, projectType, {
      [LibraryStepType.BLOCK_TEMPLATES]: templates,
      [LibraryStepType.CUSTOM_BLOCK]: customBlocks,
    });

    if (!aiPlaygroundEnabled) {
      numCollapsedSteps -= 1;
      sections = sections.filter((section) => section.label !== AI_LABEL);
    }

    const allSections = isExpanded ? sections : sections.slice(0, numCollapsedSteps);
    const groupedSections = new Map<string, Array<TopStepItem | TopLibraryItem>>();

    allSections.forEach((section) => {
      if (section.label === EVENT_LABEL) {
        groupedSections.set(EVENT_LABEL, [section]);
      } else {
        groupedSections.set('other', [...(groupedSections.get('other') ?? []), section]);
      }
    });

    return [groupedSections.get(EVENT_LABEL)?.[0], groupedSections.get('other'), numCollapsedSteps];
  }, [platform, projectType, isExpanded, templates, customBlocks, aiPlaygroundEnabled]);

  return (
    <>
      {canEditCanvas && (
        <S.TopLevelOuterContainer id={Identifier.STEP_MENU}>
          {eventSection && (
            <S.TopLevelInnerContainer size={1}>
              <TopLevelButton key={eventSection.label} section={eventSection} animationIndex={Math.max(0, 0 - numCollapsedSteps)} />
            </S.TopLevelInnerContainer>
          )}
          {otherSections && (
            <S.TopLevelInnerContainer size={otherSections.length}>
              {otherSections.map((section, index) => (
                <TopLevelButton key={section.label} section={section} animationIndex={Math.max(0, index - numCollapsedSteps)} />
              ))}
            </S.TopLevelInnerContainer>
          )}

          <S.StepMenuExpandButton onClick={() => toggleIsExpanded(!isExpanded)}>
            <SvgIcon icon="arrowToggleV2" size={20} color="#6e849a" inline rotation={isExpanded ? 270 : 90} />
          </S.StepMenuExpandButton>
        </S.TopLevelOuterContainer>
      )}
    </>
  );
};

export default StepMenu;
