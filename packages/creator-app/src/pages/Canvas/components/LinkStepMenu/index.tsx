import * as Realtime from '@voiceflow/realtime-sdk';
import { buildVirtualElement, Menu, Portal, useVirtualElementPopper } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import * as CanvasTemplates from '@/ducks/canvasTemplate';
import * as ProjectV2 from '@/ducks/projectV2';
import { useFeature, usePermission, useSelector } from '@/hooks';
import { EVENT_LABEL, getAllSections } from '@/pages/Project/components/StepMenu/constants';

import { MenuButton } from './components';

const LinkStepMenu: React.FC<{ position?: [number, number] }> = ({ position }) => {
  const virtualElement = React.useMemo(() => buildVirtualElement(position), [position]);
  const popper = useVirtualElementPopper(virtualElement, { strategy: 'fixed', placement: 'right-start' });

  const blockTemplates = useFeature(Realtime.FeatureFlag.BLOCK_TEMPLATE);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const projectType = useSelector(ProjectV2.active.projectTypeSelector);
  const templates = useSelector(CanvasTemplates.allCanvasTemplatesSelector);
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);

  const steps = getAllSections(platform, projectType, templates).filter((step) => {
    if (step.isLibrary && !blockTemplates.isEnabled) return false;
    if (step.label === EVENT_LABEL) return false;
    return true;
  });

  return (
    <Portal portalNode={document.body}>
      <div ref={popper.setPopperElement} style={{ ...popper.styles.popper, zIndex: 10 }} {...popper.attributes.popper}>
        {canEditCanvas && (
          <Menu width={148}>
            {steps.map((step) => (
              <MenuButton key={step.label} step={step} />
            ))}
          </Menu>
        )}
      </div>
    </Portal>
  );
};

export default LinkStepMenu;
