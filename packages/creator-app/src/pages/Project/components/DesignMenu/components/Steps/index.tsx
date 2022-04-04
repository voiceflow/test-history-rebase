import React from 'react';

import { UncontrolledCollapse } from '@/components/Collapsable';
import CustomScrollbars from '@/components/CustomScrollbars';
import { IS_PRIVATE_CLOUD } from '@/config';
import { FeatureFlag } from '@/config/features';
import { BlockCategory, BlockType, DragItem } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';
import * as UI from '@/ducks/ui';
import { useDispatch, useDragPreview, useFeature, useSelector } from '@/hooks';
import { Identifier } from '@/styles/constants';

import ScrollbarsContainer from '../ScrollbarsContainer';
import { Container, Item } from './components';
import { getSections } from './constants';
import { StepDragItem } from './types';

const Steps: React.FC = () => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const projectType = useSelector(ProjectV2.active.projectTypeSelector);
  const expandedSections = useSelector(UI.openBlockMenuSectionsSelector);
  const toggleSection = useDispatch(UI.toggleBlockMenuSection);
  const gadgets = useFeature(FeatureFlag.GADGETS);
  const captureV2 = useFeature(FeatureFlag.CAPTURE_V2);
  const topicsAndComponents = useFeature(FeatureFlag.TOPICS_AND_COMPONENTS);
  const isTopicsAndComponentsVersion = useSelector(ProjectV2.active.isTopicsAndComponentsVersionSelector);

  const sections = React.useMemo(() => {
    const platformSections = getSections(platform, projectType);

    return platformSections.map((platformSection) => ({
      ...platformSection,
      steps: platformSection.steps.filter((step) => {
        if (!gadgets.isEnabled && step.type === BlockType.EVENT) return false;
        if (captureV2.isEnabled) {
          if (step.type === BlockType.CAPTURE) return false;
        } else if (step.type === BlockType.CAPTUREV2) {
          return false;
        }
        if (!(topicsAndComponents.isEnabled && isTopicsAndComponentsVersion) && step.type === BlockType.COMPONENT) return false;
        if (topicsAndComponents.isEnabled && isTopicsAndComponentsVersion && step.type === BlockType.FLOW) return false;
        if (IS_PRIVATE_CLOUD && step.publicOnly) return false;

        return true;
      }),
    }));
  }, [platform, isTopicsAndComponentsVersion]);

  const expandedSectionsMap = React.useMemo(
    () => expandedSections.reduce<Partial<Record<BlockCategory, boolean>>>((obj, type) => Object.assign(obj, { [type]: true }), {}),
    [expandedSections]
  );

  useDragPreview<StepDragItem>(DragItem.BLOCK_MENU, (props) => <Item {...props} type={props.blockType} isDraggingPreview />, {
    horizontalEnabled: true,
  });

  return (
    <ScrollbarsContainer>
      <CustomScrollbars>
        <Container id={Identifier.STEP_MENU} fadeLeft={!!topicsAndComponents.isEnabled && isTopicsAndComponentsVersion}>
          {sections.map(({ type, label, steps }) =>
            steps.length ? (
              <UncontrolledCollapse
                key={type}
                type={type}
                title={label}
                isOpen={!!expandedSectionsMap[type]}
                onToggle={() => toggleSection(type)}
                iconProps={{ size: 9 }}
              >
                {steps.map((step) => (
                  <Item key={`${step.type}-${step.label}`} {...step} />
                ))}
              </UncontrolledCollapse>
            ) : null
          )}
        </Container>
      </CustomScrollbars>
    </ScrollbarsContainer>
  );
};

export default Steps;
