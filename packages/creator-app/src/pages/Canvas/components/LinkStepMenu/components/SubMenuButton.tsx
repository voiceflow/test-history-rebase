import { BaseModels } from '@voiceflow/base-types';
import { PlanType } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, MenuItem, Portal, stopPropagation, SvgIcon, SvgIconTypes, TippyTooltip, usePopper } from '@voiceflow/ui';
import React from 'react';

import { getLockedStepTooltipText, isLockedStep, lockedStepTooltipButtonText, lockedStepTypes } from '@/config/planLimits/steps';
import { ModalType, StepMenuType } from '@/constants';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useHover, useModals, useSelector, useTheme } from '@/hooks';
import { EngineContext, LinkStepMenuContext } from '@/pages/Canvas/contexts';
import { ClassName } from '@/styles/constants';

import { StyledText, TooltipContainer } from '../styles';

const BLOCK_HEADER_HEIGHT = 50.5;

export interface LinkStepItem {
  type: Realtime.BlockType;
  icon: SvgIconTypes.Icon | React.FC;
  label: string;
  factoryData?: Realtime.NodeData<any>;
  tooltipLink?: string;
}

interface SubMenuButtonProps {
  step?: LinkStepItem;
  template?: BaseModels.Version.CanvasTemplate;
  upgradePopperRef?: React.Ref<HTMLDivElement>;
}

const SubMenuButton: React.FC<SubMenuButtonProps> = ({ step, template, upgradePopperRef }) => {
  const engine = React.useContext(EngineContext)!;
  const stepMenu = React.useContext(LinkStepMenuContext)!;
  const theme = useTheme();
  const plan = useSelector(WorkspaceV2.active.planSelector);
  const isLocked = step ? isLockedStep(plan, step.type) : false;
  const [isHovered, , hoverHandlers] = useHover({});

  const { open: openPaymentModal } = useModals<{ planType: PlanType }>(ModalType.PAYMENT);

  const popper = usePopper({ strategy: 'fixed', placement: 'right-start' });

  const onClick = async () => {
    if (!stepMenu.nodePosition) return;

    const coords = stepMenu.nodePosition
      .sub([0, (theme.components.blockStep.minHeight + BLOCK_HEADER_HEIGHT) / 2])
      .add([theme.components.block.width / 2, 0]);

    if (template) {
      // await engine.canvasTemplate.dropTemplate(template.id, coords);
      stepMenu.onHide({ abort: true });
    } else if (step) {
      const nodeID = await engine.node.add(step.type, coords, step.factoryData, StepMenuType.LINK);
      const portID = Realtime.Utils.port.getInPortID(nodeID);
      await engine.linkCreation.complete(portID);
      stepMenu.onHide({ abort: false });
      await engine.setActive(nodeID);
    }
  };

  return (
    <MenuItem
      ref={popper.setReferenceElement}
      className={ClassName.SUB_STEP_MENU_ITEM}
      disabled={isLocked as boolean}
      onClick={isLocked ? () => {} : stopPropagation(onClick)}
      {...hoverHandlers}
    >
      <Box.FlexStart width="100%">
        {step?.icon && <SvgIcon icon={step.icon} size={16} color={isLocked ? '#62778c' : '#132144'} />}

        <StyledText disabled={isLocked as boolean} isLibrary={!!template}>
          {step && step.label}
          {template && template.name}
        </StyledText>
      </Box.FlexStart>

      {isHovered && isLocked && step && (
        <Portal portalNode={document.body}>
          <div ref={popper.setPopperElement} style={{ ...popper.styles.popper, paddingLeft: '6px' }} {...popper.attributes.popper}>
            <div ref={upgradePopperRef}>
              <TooltipContainer>
                <TippyTooltip.FooterButton
                  width={isLocked ? 200 : 168}
                  onClick={isLocked ? () => openPaymentModal() : () => window.open(step?.tooltipLink, '_blank')}
                  buttonText={isLocked ? lockedStepTooltipButtonText : 'Learn More'}
                >
                  {getLockedStepTooltipText(step.type as lockedStepTypes)}
                </TippyTooltip.FooterButton>
              </TooltipContainer>
            </div>
          </div>
        </Portal>
      )}
    </MenuItem>
  );
};

export default React.memo(SubMenuButton);
