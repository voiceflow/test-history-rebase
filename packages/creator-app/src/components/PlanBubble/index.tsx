import { PlanType } from '@voiceflow/internal';
import React from 'react';

import BubbleText from '@/components/BubbleText';
import { Permission } from '@/config/permissions';
import { ModalType, PLAN_TYPE_META } from '@/constants';
import { useModals, usePermission } from '@/hooks';
import { DashboardClassName } from '@/styles/constants';

interface PlanBubble {
  plan?: PlanType | null;
  disabled?: boolean;
}

const PlanBubble: React.OldFC<PlanBubble> = ({ plan, disabled }) => {
  const [canUpgrade] = usePermission(Permission.UPGRADE_WORKSPACE);
  const [canManageBilling] = usePermission(Permission.MANAGE_BILLING);
  const { open: openPaymentsModal } = useModals(ModalType.PAYMENT);
  const allowedToClick = !disabled && canUpgrade && canManageBilling;

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
