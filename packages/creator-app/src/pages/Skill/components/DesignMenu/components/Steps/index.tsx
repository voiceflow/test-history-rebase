import React from 'react';

import { UncontrolledCollapse } from '@/components/Collapsable';
import CustomScrollbars from '@/components/CustomScrollbars';
import { IS_PRIVATE_CLOUD } from '@/config';
import { FeatureFlag } from '@/config/features';
import { BlockCategory, BlockType, DragItem } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';
import * as UI from '@/ducks/ui';
import { connect } from '@/hocs';
import { useDragPreview, useFeature } from '@/hooks';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import ScrollbarsContainer from '../ScrollbarsContainer';
import { Container, Item } from './components';
import { getSections } from './constants';
import { StepDragItem } from './types';

const Steps: React.FC<ConnectedStepsProps> = ({ platform, toggleSection, expandedSections }) => {
  const gadgets = useFeature(FeatureFlag.GADGETS);
  const topicsAndComponents = useFeature(FeatureFlag.TOPICS_AND_COMPONENTS);

  const sections = React.useMemo(() => {
    const platformSections = getSections(platform);

    return platformSections.map((platformSection) => ({
      ...platformSection,
      steps: platformSection.steps.filter((step) => {
        if (!gadgets.isEnabled && step.type === BlockType.EVENT) return false;
        if (IS_PRIVATE_CLOUD && step.publicOnly) return false;

        return true;
      }),
    }));
  }, [platform]);

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
        <Container id={Identifier.STEP_MENU} fadeLeft={!!topicsAndComponents.isEnabled}>
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

const mapStateToProps = {
  platform: ProjectV2.active.platformSelector,
  expandedSections: UI.openBlockMenuSectionsSelector,
};

const mapDispatchToProps = {
  toggleSection: UI.toggleBlockMenuSection,
};

type ConnectedStepsProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Steps) as React.FC;
