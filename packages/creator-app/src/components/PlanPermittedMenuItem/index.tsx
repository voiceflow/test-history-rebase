import { PlanType } from '@voiceflow/internal';
import { SvgIcon, swallowEvent, TippyTooltip, TippyTooltipProps } from '@voiceflow/ui';
import React from 'react';

import UpgradePopper, { UpgradePopperProps } from '@/components/UpgradePopper';
import UpgradeTooltip, { UpgradeTooltipProps } from '@/components/UpgradeTooltip';
import { PlanPermissionKey, PlanPermissions, UpgradeTooltipPermission } from '@/config/planPermission';
import { UpgradePrompt } from '@/ducks/tracking';
import { usePlanPermission } from '@/hooks/planPermission';

import * as S from './styles';

interface PlanPermittedMenuItemProps<P extends PlanPermissionKey> {
  label: React.ReactNode;
  isFocused?: boolean;
  permission: P | null;
  popperProps?: UpgradePopperProps['popperProps'];
  upgradePrompt: UpgradePrompt;
  tooltipProps?: UpgradeTooltipProps['tooltipProps'];
  // TippyTooltip doesn't support nested tooltips
  // so we need to have a label tooltip and upgrade tooltip on the same level
  labelTooltip?: TippyTooltipProps;
}

interface UnknownData {
  data?: unknown;
}

type PlanPermissionDataProps<P extends PlanPermissionKey> = NonNullable<PlanPermissions[P][PlanType]> extends UpgradeTooltipPermission<infer Data>
  ? { data: Data }
  : UnknownData;

const PlanPermittedMenuItem = <P extends PlanPermissionKey>({
  data,
  label,
  isFocused,
  permission,
  popperProps,
  tooltipProps,
  labelTooltip,
  upgradePrompt,
}: PlanPermittedMenuItemProps<P> & PlanPermissionDataProps<P>): React.ReactElement => {
  const planPermission = usePlanPermission(permission);

  const labelElement = <S.Label fullWidth>{label}</S.Label>;
  const labelWithTooltip = labelTooltip ? (
    <TippyTooltip
      tag="div"
      style={{ display: 'flex', width: '100%', height: '100%' }}
      delay={[200, 0]}
      offset={[0, planPermission ? 46 : 30]}
      {...labelTooltip}
    >
      {labelElement}
    </TippyTooltip>
  ) : (
    labelElement
  );

  if (!planPermission || !('getUpgradeTooltip' in planPermission)) return <S.Container>{labelWithTooltip}</S.Container>;

  const popper = 'getUpgradePopper' in planPermission && planPermission.getUpgradePopper(data as any);
  const tooltip = planPermission.getUpgradeTooltip(data as any);

  const content = (
    <>
      {labelWithTooltip}

      <UpgradeTooltip {...tooltip} tooltipProps={tooltipProps}>
        <SvgIcon icon="paid" clickable color="#6e849a" reducedOpacity={!isFocused} />
      </UpgradeTooltip>
    </>
  );

  return !popper ? (
    <S.Container>{content}</S.Container>
  ) : (
    <UpgradePopper {...popper} popperProps={{ modifiers: { offset: { offset: '0,0' } }, ...popperProps }} upgradePrompt={upgradePrompt}>
      {({ ref, onToggle }) => (
        <S.Container ref={ref} onClick={swallowEvent(onToggle)}>
          {content}
        </S.Container>
      )}
    </UpgradePopper>
  );
};

export default PlanPermittedMenuItem;
