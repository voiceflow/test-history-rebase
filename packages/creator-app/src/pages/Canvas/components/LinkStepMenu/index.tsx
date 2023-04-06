import { buildVirtualElement, Menu, Portal, useOnClickOutside, useVirtualElementPopper } from '@voiceflow/ui';
import React from 'react';

import { useProjectAIPlayground } from '@/components/GPT/hooks';
import { Permission } from '@/constants/permissions';
import * as CanvasTemplates from '@/ducks/canvasTemplate';
import * as CustomBlocks from '@/ducks/customBlock';
import * as ProjectV2 from '@/ducks/projectV2';
import { usePermission, useSelector } from '@/hooks';
import { LinkStepMenuContext } from '@/pages/Canvas/contexts';
import { AI_LABEL, EVENT_LABEL, getAllSections, LibraryStepType } from '@/pages/Project/components/StepMenu/constants';

import { StepMenuItem, TemplateMenuItem } from './components';

const getPopperOffset = ({ placement }: { placement: string }): [number, number] => (placement === 'right-end' ? [0, 14] : [-5, 14]);

const LinkStepMenu: React.FC = () => {
  const { onHide, position } = React.useContext(LinkStepMenuContext)!;

  const virtualElement = React.useMemo(() => buildVirtualElement(position), [position]);

  const popper = useVirtualElementPopper(virtualElement, {
    strategy: 'fixed',
    placement: 'right-start',
    modifiers: [{ name: 'offset', options: { offset: getPopperOffset } }],
  });
  const upgradePopperRef = React.useRef<HTMLDivElement>(null);
  const popperContainerRef = React.useRef<HTMLUListElement>(null);
  const subMenuContainerRef = React.useRef<HTMLDivElement>(null);

  const platform = useSelector(ProjectV2.active.platformSelector);
  const templates = useSelector(CanvasTemplates.allCanvasTemplatesSelector);
  const projectType = useSelector(ProjectV2.active.projectTypeSelector);
  const customBlocks = useSelector(CustomBlocks.allCustomBlocksSelector);
  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);

  const aiPlaygroundEnabled = useProjectAIPlayground();

  const steps = React.useMemo(
    () =>
      getAllSections(platform, projectType, {
        [LibraryStepType.CUSTOM_BLOCK]: customBlocks,
        [LibraryStepType.BLOCK_TEMPLATES]: templates,
      }).filter((step) => {
        if (step.label === EVENT_LABEL) return false;
        if (!aiPlaygroundEnabled && step.label === AI_LABEL) return false;
        if (step.isLibrary && !step.librarySections.templates.length) return false;
        return true;
      }),
    [platform, projectType, templates, customBlocks]
  );

  useOnClickOutside(
    [popperContainerRef],
    (event: MouseEvent | TouchEvent) => {
      if (
        !subMenuContainerRef.current?.contains(event.target as Node) &&
        !upgradePopperRef.current?.contains(event.target as Node) &&
        event instanceof MouseEvent &&
        event.clientX !== position[0] &&
        event.clientY !== position[1]
      ) {
        onHide({ abort: true });
      }
    },
    [onHide]
  );

  return (
    <Portal portalNode={document.body}>
      <div ref={popper.setPopperElement} style={{ ...popper.styles.popper, zIndex: 10 }} {...popper.attributes.popper}>
        {canEditCanvas && (
          <Menu ref={popperContainerRef} width={148} noMargins>
            {steps.map((step) =>
              step.isLibrary ? (
                <TemplateMenuItem key={step.label} item={step} popperContainerRef={subMenuContainerRef} />
              ) : (
                <StepMenuItem key={step.label} item={step} upgradePopperRef={upgradePopperRef} popperContainerRef={subMenuContainerRef} />
              )
            )}
          </Menu>
        )}
      </div>
    </Portal>
  );
};

const NewLinkContainer: React.FC = () => {
  const stepMenuContext = React.useContext(LinkStepMenuContext)!;

  return stepMenuContext.isOpen ? <LinkStepMenu /> : null;
};

export default NewLinkContainer;
