import * as Realtime from '@voiceflow/realtime-sdk';
import { buildVirtualElement, Menu, Portal, useOnClickOutside, useVirtualElementPopper } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import * as CanvasTemplates from '@/ducks/canvasTemplate';
import * as ProjectV2 from '@/ducks/projectV2';
import { useFeature, usePermission, useSelector } from '@/hooks';
import { LinkStepMenuContext } from '@/pages/Canvas/contexts';
import { EVENT_LABEL, getAllSections } from '@/pages/Project/components/StepMenu/constants';

import { MenuButton } from './components';

const LinkStepMenu: React.FC<{}> = () => {
  const stepMenuContext = React.useContext(LinkStepMenuContext)!;
  const virtualElement = React.useMemo(() => buildVirtualElement(stepMenuContext.position), [stepMenuContext.position]);
  const popper = useVirtualElementPopper(virtualElement, {
    strategy: 'fixed',
    placement: 'right-start',
    modifiers: [{ name: 'offset', options: { offset: [-6, 14] } }],
  });
  const popperContainerRef = React.useRef<HTMLUListElement>(null);
  const subMenuContainerRef = React.useRef<HTMLDivElement>(null);
  const upgradePopperRef = React.useRef<HTMLDivElement>(null);

  const blockTemplate = useFeature(Realtime.FeatureFlag.BLOCK_TEMPLATE);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const projectType = useSelector(ProjectV2.active.projectTypeSelector);
  const templates = useSelector(CanvasTemplates.allCanvasTemplatesSelector);
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);

  const steps = getAllSections(platform, projectType, templates).filter((step) => {
    if (step.isLibrary && !blockTemplate.isEnabled) return false;
    if (step.label === EVENT_LABEL) return false;
    return true;
  });

  useOnClickOutside(
    [popperContainerRef],
    (event: MouseEvent | TouchEvent) => {
      if (
        !subMenuContainerRef.current?.contains(event.target as Node) &&
        !upgradePopperRef.current?.contains(event.target as Node) &&
        stepMenuContext.isOpen &&
        event instanceof MouseEvent &&
        event.clientX !== stepMenuContext.position[0] &&
        event.clientY !== stepMenuContext.position[1]
      ) {
        stepMenuContext.onHide({});
      }
    },
    [stepMenuContext.isOpen, stepMenuContext.onHide]
  );

  if (!stepMenuContext.isOpen) {
    return null;
  }

  return (
    <Portal portalNode={document.body}>
      <div ref={popper.setPopperElement} style={{ ...popper.styles.popper, zIndex: 10 }} {...popper.attributes.popper}>
        {canEditCanvas && (
          <Menu width={148} ref={popperContainerRef}>
            {steps.map((step) => (
              <MenuButton key={step.label} step={step} popperContainerRef={subMenuContainerRef} upgradePopperRef={upgradePopperRef} />
            ))}
          </Menu>
        )}
      </div>
    </Portal>
  );
};

export default LinkStepMenu;
