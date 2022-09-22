import { BaseModels } from '@voiceflow/base-types';
import { Menu, Portal, usePopper } from '@voiceflow/ui';
import React from 'react';

import { useCanvasNodeFilter } from '@/hooks';
import { getManager } from '@/pages/Canvas/managers/utils';
import { StepItem } from '@/pages/Project/components/StepMenu/constants';

import SubMenuButton, { LinkStepItem } from './SubMenuButton';

interface SubMenuProps {
  steps?: StepItem[];
  templates?: BaseModels.Version.CanvasTemplate[];
  popperContainerRef?: React.Ref<HTMLDivElement>;
  upgradePopperRef?: React.Ref<HTMLDivElement>;
}

const getPopperOffset = ({ placement }: { placement: string }): [number, number] => (placement === 'right-end' ? [0, 0] : [-40, 0]);

const SubMenu: React.FC<SubMenuProps> = ({ steps, templates, popperContainerRef, upgradePopperRef }) => {
  const rootPopper = usePopper({
    modifiers: [{ name: 'offset', options: { offset: getPopperOffset } }],
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
        <div ref={rootPopper.setPopperElement} style={rootPopper.styles.popper} {...rootPopper.attributes.popper}>
          <div ref={popperContainerRef}>
            <Menu noMargins>
              {processedTemplates.map((template) => (
                <SubMenuButton key={template.name} template={template} />
              ))}

              {processedSteps.map((step) => (
                <SubMenuButton key={step.label} step={step} upgradePopperRef={upgradePopperRef} />
              ))}
            </Menu>
          </div>
        </div>
      </Portal>
    </div>
  );
};

export default SubMenu;
