import React from 'react';

import BubbleText from '@/components/BubbleText';
import { Permission } from '@/config/permissions';
import { ModalType, PLAN_TYPE_META, PlanType } from '@/constants';
import { useModals, usePermission } from '@/hooks';

type PlanBubble = {
  plan: PlanType;
};

const PlanBubble: React.FC<PlanBubble> = ({ plan }) => {
  const { color, label } = PLAN_TYPE_META[plan];
  const [canUpgrade] = usePermission(Permission.UPGRADE_WORKSPACE);
  const [canManageBilling] = usePermission(Permission.MANAGE_BILLING);
  const { open: openPaymentsModal } = useModals(ModalType.PAYMENT);
  const allowedToClick = canUpgrade && canManageBilling;

  const onClick = () => {
    if (allowedToClick) {
      openPaymentsModal();
    }
  };
  return (
    <BubbleText onClick={onClick} color={color} clickable={allowedToClick}>
      {plan === PlanType.STARTER || plan === PlanType.OLD_STARTER ? 'Free' : label}
    </BubbleText>
  );
};

export default PlanBubble;
