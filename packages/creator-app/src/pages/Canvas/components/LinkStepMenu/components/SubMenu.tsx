import { BaseModels } from '@voiceflow/base-types';
import { Animations, Menu, Portal, usePopper } from '@voiceflow/ui';
import React from 'react';

import { useCanvasNodeFilter } from '@/hooks';
import { getManager } from '@/pages/Canvas/managers/utils';
import { StepItem } from '@/pages/Project/components/StepMenu/constants';
import { ClassName } from '@/styles/constants';

import SubMenuButton, { LinkStepItem } from './SubMenuButton';

interface SubMenuProps {
  steps?: StepItem[];
  templates?: BaseModels.Version.CanvasTemplate[];
}

const SubMenu: React.FC<SubMenuProps> = ({ steps, templates }) => {
  const rootPopper = usePopper({
    modifiers: [{ name: 'offset', options: { offset: [-40, 0] } }],
    placement: 'right-start',
  });

  const processedTemplates = React.useMemo(
    () =>
      [...(templates ?? [])]?.sort((l, r) => {
        if (l.name > r.name) return 1;
        if (l.name < r.name) return -1;
        return 0;
      }),
    []
  );

  const nodeFilter = useCanvasNodeFilter();
  const processedSteps = React.useMemo(
    () =>
      steps?.filter(nodeFilter).map<LinkStepItem>((step) => {
        const manager = getManager(step.type, true);
        return {
          ...step,
          icon: step.getIcon(manager),
          label: step.getLabel(manager),
          tooltipText: step.getStepTooltipText(manager),
          tooltipLink: step.getStepTooltipLink(manager),
        };
      }) ?? [],
    [nodeFilter]
  );

  return (
    <div ref={rootPopper.setReferenceElement}>
      <Portal portalNode={document.body}>
        <div ref={rootPopper.setPopperElement} style={rootPopper.styles.popper} {...rootPopper.attributes.popper} className={ClassName.SUB_STEP_MENU}>
          <Menu>
            {processedTemplates.map((template, index) => (
              <Animations.FadeDownDelayedContainer key={template.name} delay={0.04 + index * 0.03}>
                <div>
                  <SubMenuButton template={template} />
                </div>
              </Animations.FadeDownDelayedContainer>
            ))}
            {processedSteps.map((step, index) => (
              <Animations.FadeDownDelayedContainer key={step.label} delay={0.04 + index * 0.03}>
                <div>
                  <SubMenuButton step={step} />
                </div>
              </Animations.FadeDownDelayedContainer>
            ))}
          </Menu>
        </div>
      </Portal>
    </div>
  );
};

export default SubMenu;
