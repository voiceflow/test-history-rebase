import { PlanType } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Portal, stopPropagation, SvgIconTypes, TippyTooltip, usePopper } from '@voiceflow/ui';
import React from 'react';

import { getLockedStepTooltipText, isLockedStep, lockedStepTooltipButtonText, LockedStepTypes } from '@/config/planLimits/steps';
import { ModalType, StepMenuType } from '@/constants';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useHover, useModals, useSelector } from '@/hooks';

import { useOnCreate } from './hooks';
import SubMenuItem from './SubMenuItem';
import TooltipContainer from './TooltipContainer';

export interface StepSubItem {
  type: Realtime.BlockType;
  icon: SvgIconTypes.Icon;
  label: string;
  factoryData?: Realtime.NodeData<any>;
  tooltipLink?: string;
}

interface StepSubMenuItemProps {
  item: StepSubItem;
  upgradePopperRef?: React.Ref<HTMLDivElement>;
}

const StepSubMenuItem: React.OldFC<StepSubMenuItemProps> = ({ item, upgradePopperRef }) => {
  const plan = useSelector(WorkspaceV2.active.planSelector);
  const [isHovered, , hoverHandlers] = useHover();

  const { open: openPaymentModal } = useModals<{ planType: PlanType }>(ModalType.PAYMENT);

  const popper = usePopper({ strategy: 'fixed', placement: 'right' });

  const onClick = useOnCreate(async ({ coords, engine, stepMenu }) => {
    const nodeID = await engine.node.add(item.type, coords, item.factoryData, StepMenuType.LINK);

    const portID = Realtime.Utils.port.getInPortID(nodeID);

    await engine.linkCreation.complete(portID);

    stepMenu.onHide();

    await engine.setActive(nodeID);
  });

  const isLocked = isLockedStep(plan, item.type);

  return (
    <SubMenuItem
      ref={popper.setReferenceElement}
      icon={item.icon}
      label={item.label}
      onClick={isLocked ? undefined : stopPropagation(onClick)}
      disabled={!!isLocked}
      iconProps={{ color: isLocked ? '#62778c' : '#132144' }}
      {...hoverHandlers}
    >
      {isHovered && isLocked && (
        <Portal portalNode={document.body}>
          <div ref={popper.setPopperElement} style={{ ...popper.styles.popper, paddingLeft: '6px' }} {...popper.attributes.popper}>
            <div ref={upgradePopperRef}>
              <TooltipContainer width={isLocked ? 232 : 200}>
                <TippyTooltip.FooterButton
                  onClick={() => (isLocked ? openPaymentModal() : item.tooltipLink && window.open(item.tooltipLink, '_blank'))}
                  buttonText={isLocked ? lockedStepTooltipButtonText : 'Learn More'}
                >
                  {getLockedStepTooltipText(item.type as LockedStepTypes)}
                </TippyTooltip.FooterButton>
              </TooltipContainer>
            </div>
          </div>
        </Portal>
      )}
    </SubMenuItem>
  );
};

export default React.memo(StepSubMenuItem);
