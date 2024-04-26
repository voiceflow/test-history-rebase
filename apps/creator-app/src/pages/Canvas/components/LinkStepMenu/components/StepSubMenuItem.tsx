import * as Realtime from '@voiceflow/realtime-sdk';
import type { SvgIconTypes } from '@voiceflow/ui';
import { Portal, stopPropagation, TippyTooltip, usePopper } from '@voiceflow/ui';
import React from 'react';

import { StepMenuType } from '@/constants';
import { Permission } from '@/constants/permissions';
import { useHover } from '@/hooks/hover';
import { usePaymentModal } from '@/hooks/modal.hook';
import { usePermission } from '@/hooks/permission';

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

const StepSubMenuItem: React.FC<StepSubMenuItemProps> = ({ item, upgradePopperRef }) => {
  const [isHovered, , hoverHandlers] = useHover();

  const paymentModal = usePaymentModal();
  const paidStepsPermission = usePermission(Permission.CANVAS_PAID_STEPS);

  const popper = usePopper({ strategy: 'fixed', placement: 'right' });

  const onClick = useOnCreate(async ({ coords, engine, stepMenu }) => {
    const nodeID = await engine.node.add({
      type: item.type,
      coords,
      menuType: StepMenuType.LINK,
      factoryData: item.factoryData,
    });

    const portID = Realtime.Utils.port.getInPortID(nodeID);

    await engine.linkCreation.complete(portID);

    stepMenu.onHide();

    await engine.setActive(nodeID);
  });

  const { type } = item;
  const isLocked = !paidStepsPermission.allowed && paidStepsPermission.planConfig?.isPaidStep(type);
  const upgradeTooltip = isLocked ? paidStepsPermission.planConfig?.upgradeTooltip({ stepType: type }) : null;

  return (
    <SubMenuItem
      ref={popper.setReferenceElement}
      icon={item.icon}
      label={item.label}
      onClick={isLocked ? undefined : stopPropagation(onClick)}
      disabled={isLocked}
      iconProps={{ color: isLocked ? '#62778c' : '#132144' }}
      {...hoverHandlers}
    >
      {isHovered && isLocked && !!upgradeTooltip && (
        <Portal portalNode={document.body}>
          <div
            ref={popper.setPopperElement}
            style={{ ...popper.styles.popper, paddingLeft: '6px' }}
            {...popper.attributes.popper}
          >
            <div ref={upgradePopperRef}>
              <TooltipContainer width={232}>
                <TippyTooltip.FooterButton
                  onClick={() => paymentModal.openVoid({})}
                  buttonText={upgradeTooltip.upgradeButtonText}
                >
                  {upgradeTooltip.description}
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
