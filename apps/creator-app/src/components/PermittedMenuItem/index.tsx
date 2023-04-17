import { SvgIcon, swallowEvent, TippyTooltip, TippyTooltipProps } from '@voiceflow/ui';
import React from 'react';

import UpgradePopper, { UpgradePopperProps } from '@/components/UpgradePopper';
import UpgradeTooltip, { UpgradeTooltipProps } from '@/components/UpgradeTooltip';
import { PlanPermissionKey, PlanPermissions, UpgradeTooltipPlanPermission } from '@/config/planPermission';
import type { UpgradePopperRolePermission, UpgradeTooltipRolePermission } from '@/config/rolePermission';
import { usePermission } from '@/hooks/permission';
import { getDefaultWarnMessage, PermissionConfig } from '@/utils/permission';

import * as S from './styles';

interface PlanPermittedMenuItemProps<P extends PlanPermissionKey> {
  label: React.ReactNode;
  isAllowed?: boolean | null;
  isFocused?: boolean;
  permission: P | null;
  popperProps?: UpgradePopperProps['popperProps'];
  tooltipProps?: UpgradeTooltipProps['tooltipProps'];
  // TippyTooltip doesn't support nested tooltips
  // so we need to have a label tooltip and upgrade tooltip on the same level
  labelTooltip?: TippyTooltipProps;
}

interface UnknownData {
  data?: unknown;
}

type PlanPermissionDataProps<P extends PlanPermissionKey> = PlanPermissions[P] extends UpgradeTooltipPlanPermission<infer Data>
  ? { data: Data }
  : UnknownData;

const getUpgradePopper = <P extends PlanPermissionKey>(permissionConfig: PermissionConfig<P>, data: any) => {
  if (!permissionConfig.planAllowed && permissionConfig.planConfig && 'upgradePopper' in permissionConfig.planConfig) {
    return permissionConfig.planConfig.upgradePopper(data);
  }

  if (!permissionConfig.roleAllowed && permissionConfig.roleConfig && 'upgradePopper' in permissionConfig.roleConfig) {
    // TODO: needs as since role config doesn't have upgrade popper permission yet
    return (permissionConfig.roleConfig as UpgradePopperRolePermission<any>).upgradePopper(data);
  }

  return null;
};

const getUpgradeTooltip = <P extends PlanPermissionKey>(permissionConfig: PermissionConfig<P>, data: any) => {
  if (!permissionConfig.planAllowed && permissionConfig.planConfig && 'upgradeTooltip' in permissionConfig.planConfig) {
    return permissionConfig.planConfig.upgradeTooltip(data);
  }

  if (!permissionConfig.roleAllowed && permissionConfig.roleConfig && 'upgradeTooltip' in permissionConfig.roleConfig) {
    // TODO: needs as since role config doesn't have upgrade popper permission yet
    return (permissionConfig.roleConfig as UpgradeTooltipRolePermission<any>).upgradeTooltip(data);
  }

  return null;
};

const PermittedMenuItem = <P extends PlanPermissionKey>({
  data,
  label,
  isAllowed,
  isFocused,
  permission,
  popperProps,
  tooltipProps,
  labelTooltip,
}: PlanPermittedMenuItemProps<P> & PlanPermissionDataProps<P>): React.ReactElement => {
  const permissionConfig = usePermission(permission);

  const labelElement = <S.Label fullWidth>{label}</S.Label>;
  const labelWithTooltip = labelTooltip ? (
    <TippyTooltip
      tag="div"
      style={{ display: 'flex', width: '100%', height: '100%' }}
      delay={[200, 0]}
      offset={[0, !permissionConfig.allowed ? 46 : 30]}
      {...labelTooltip}
    >
      {labelElement}
    </TippyTooltip>
  ) : (
    labelElement
  );

  if (permissionConfig.allowed || isAllowed) return <S.Container>{labelWithTooltip}</S.Container>;

  const upgradePopper = getUpgradePopper(permissionConfig, data);
  const upgradeTooltip = getUpgradeTooltip(permissionConfig, data);

  const paidIcon = <SvgIcon icon="paid" clickable color="#6e849a" reducedOpacity={!isFocused} />;

  const content = (
    <>
      {labelWithTooltip}

      {upgradeTooltip ? (
        <UpgradeTooltip {...upgradeTooltip} tooltipProps={tooltipProps}>
          {paidIcon}
        </UpgradeTooltip>
      ) : (
        <TippyTooltip placement="right" {...tooltipProps} content={getDefaultWarnMessage(permissionConfig)}>
          {paidIcon}
        </TippyTooltip>
      )}
    </>
  );

  return !upgradePopper ? (
    <S.Container>{content}</S.Container>
  ) : (
    <UpgradePopper {...upgradePopper} popperProps={{ modifiers: { offset: { offset: '0,0' } }, ...popperProps }}>
      {({ ref, onToggle }) => (
        <S.Container ref={ref} onClick={swallowEvent(onToggle)}>
          {content}
        </S.Container>
      )}
    </UpgradePopper>
  );
};

export default PermittedMenuItem;
