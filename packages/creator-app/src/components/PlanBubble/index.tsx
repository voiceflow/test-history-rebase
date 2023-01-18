import { PlanType } from '@voiceflow/internal';
import React from 'react';

import BubbleText from '@/components/BubbleText';
import { ModalType, PLAN_TYPE_META } from '@/constants';
import { Permission } from '@/constants/permissions';
import { useModals, usePermission } from '@/hooks';
import { DashboardClassName } from '@/styles/constants';

interface PlanBubble {
  plan?: PlanType | null;
  disabled?: boolean;
}

const PlanBubble: React.FC<PlanBubble> = ({ plan, disabled }) => {
  const upgradeWorkspacePermission = usePermission(Permission.UPGRADE_WORKSPACE);
  const [canManageBilling] = usePermission(Permission.BILLING_MANAGE);
  const { open: openPaymentsModal } = useModals(ModalType.PAYMENT);
  const allowedToClick = !disabled && upgradeWorkspacePermission.allowed && canManageBilling;

  if (!plan) return null;

  const { color, label } = PLAN_TYPE_META[plan];

  const onClick = () => {
    if (allowedToClick) {
      openPaymentsModal();
    }
  };
  return (
    <BubbleText className={DashboardClassName.PLAN_BUBBLE} onClick={onClick} color={color} clickable={allowedToClick}>
      {plan === PlanType.STARTER || plan === PlanType.OLD_STARTER ? 'Free' : label}
    </BubbleText>
  );
};

export default PlanBubble;
