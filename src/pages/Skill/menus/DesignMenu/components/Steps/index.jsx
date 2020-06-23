import React from 'react';

import { UncontrolledCollapse } from '@/components/Collapsable';
import CustomScrollbars from '@/components/CustomScrollbars';
import { FeatureFlag } from '@/config/features';
import { BlockType, DragItem } from '@/constants';
import * as Skill from '@/ducks/skill';
import * as UI from '@/ducks/ui';
import { connect } from '@/hocs';
import { useDragPreview, useFeature } from '@/hooks';
import { Identifier } from '@/styles/constants';

import ScrollbarsContainer from '../ScrollbarsContainer';
import { Container, Item } from './components';
import { PLATFORM_SECTION, ROOT_SECTIONS } from './constants';

function Steps({ platform, toggleSection, expandedSections }) {
  const gadgets = useFeature(FeatureFlag.GADGETS);

  const sections = React.useMemo(() => {
    const sections = [...ROOT_SECTIONS];
    const platformSteps = PLATFORM_SECTION.steps[platform];

    if (platformSteps?.length) {
      const steps = gadgets.isEnabled ? platformSteps : platformSteps.filter(({ type }) => ![BlockType.EVENT, BlockType.DIRECTIVE].includes(type));
      sections.push({ ...PLATFORM_SECTION, steps });
    }

    return sections;
  }, [platform]);
  const expandedSectionsMap = React.useMemo(() => expandedSections.reduce((obj, type) => Object.assign(obj, { [type]: true }), {}), [
    expandedSections,
  ]);

  useDragPreview(DragItem.BLOCK_MENU, (props) => <Item {...props} type={props.blockType} isDraggingPreview />, { horizontalEnabled: true });

  return (
    <ScrollbarsContainer>
      <CustomScrollbars>
        <Container id={Identifier.STEP_MENU}>
          {sections.map(({ type, label, steps }) => (
            <UncontrolledCollapse
              key={type}
              title={label}
              isOpen={expandedSectionsMap[type]}
              onToggle={() => toggleSection(type)}
              iconProps={{ size: 9 }}
            >
              {steps.map((step) => {
                return <Item key={`${step.type}-${step.label}`} {...step} />;
              })}
            </UncontrolledCollapse>
          ))}
        </Container>
      </CustomScrollbars>
    </ScrollbarsContainer>
  );
}

const mapStateToProps = {
  platform: Skill.activePlatformSelector,
  expandedSections: UI.openBlockMenuSectionsSelector,
};

const mapDispatchToProps = {
  toggleSection: UI.toggleBlockMenuSection,
};

export default connect(mapStateToProps, mapDispatchToProps)(Steps);
