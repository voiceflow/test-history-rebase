import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { SvgIcon } from '@voiceflow/ui';
import React, { useState } from 'react';

import { useProjectAIPlayground } from '@/components/GPT/hooks';
import { Permission } from '@/constants/permissions';
import { CanvasTemplate, CustomBlock, Diagram, Project } from '@/ducks';
import { useFeature } from '@/hooks/feature';
import { usePermission } from '@/hooks/permission';
import { useLocalStorageState } from '@/hooks/storage.hook';
import { useSelector } from '@/hooks/store.hook';
import { Identifier } from '@/styles/constants';

import type { TopLibraryItem, TopStepItem } from './constants';
import { AI_LABEL, EVENT_LABEL, getAllSections, LibraryStepType } from './constants';
import * as S from './styles';
import TopLevelButton from './TopLevelButton';

const STEP_MENU_EXPANDED_LOCAL_STORAGE_KEY = 'stepMenuExpanded';

const StepMenu: React.FC = () => {
  const cmsWorkflows = useFeature(FeatureFlag.CMS_WORKFLOWS);
  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);
  const aiPlaygroundEnabled = useProjectAIPlayground();

  const isTopic = useSelector(Diagram.active.isTopicSelector);
  const platform = useSelector(Project.active.platformSelector);
  const templates = useSelector(CanvasTemplate.allCanvasTemplatesSelector);
  const projectType = useSelector(Project.active.projectTypeSelector);
  const customBlocks = useSelector(CustomBlock.allCustomBlocksSelector);

  const [isExpanded, toggleIsExpanded] = useLocalStorageState(STEP_MENU_EXPANDED_LOCAL_STORAGE_KEY, true);
  const [initialRender, setInitialRender] = useState(true);

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

  const onToggle = () => {
    toggleIsExpanded(!isExpanded);
    setInitialRender(false);
  };

  return (
    <>
      {canEditCanvas && (
        <S.TopLevelOuterContainer id={Identifier.STEP_MENU}>
          {eventSection && (!cmsWorkflows.isEnabled || isTopic) && (
            <S.TopLevelInnerContainer size={1}>
              <TopLevelButton key={eventSection.label} section={eventSection} animationIndex={-1} />
            </S.TopLevelInnerContainer>
          )}

          {otherSections && (
            <S.TopLevelInnerContainer size={otherSections.length}>
              {otherSections.map((section, index) => (
                <TopLevelButton
                  key={section.label}
                  section={section}
                  animationIndex={
                    initialRender ? -1 : Math.max(0, index - (numCollapsedSteps - (eventSection ? 1 : 0)))
                  }
                />
              ))}
            </S.TopLevelInnerContainer>
          )}

          <S.StepMenuExpandButton onClick={onToggle}>
            <SvgIcon icon="arrowToggleV2" size={20} color="#6e849a" inline rotation={isExpanded ? 270 : 90} />
          </S.StepMenuExpandButton>
        </S.TopLevelOuterContainer>
      )}
    </>
  );
};

export default StepMenu;
