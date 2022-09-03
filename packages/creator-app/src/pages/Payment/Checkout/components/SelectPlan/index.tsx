import { PlanType } from '@voiceflow/internal';
import { Flex, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { PLAN_INFO_LINK } from '@/constants';
import StepSection from '@/pages/Payment/components/Section';
import { PaymentContextProps, withPayment } from '@/pages/Payment/context';
import { Identifier } from '@/styles/constants';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

import StepHeading from '../StepHeading';
import PlanInfoCard from './PlanInfoCard';

interface SelectPlanProps {
  payment: PaymentContextProps;
}

const SelectPlan: React.FC<SelectPlanProps> = ({
  payment: {
    state: { plans, period },
  },
}) => {
  return (
    <span id={Identifier.UPGRADE_PLAN_SECTION}>
      <StepHeading
        noBottomPadding={false}
        heading="UPGRADE PLAN"
        actions={[
          {
            label: (
              <>
                See what's included
                <SvgIcon size={12} icon="next" style={{ display: 'inline-block', marginLeft: 7, marginBottom: -2 }} />
              </>
            ),
            action: onOpenInternalURLInANewTabFactory(PLAN_INFO_LINK),
          },
        ]}
      />
      <StepSection>
        <Flex>
          {plans
            .filter(({ id }) => id !== PlanType.OLD_ENTERPRISE)
            .filter(({ id }) => id !== PlanType.ENTERPRISE)
            .map((option) => (
              <PlanInfoCard key={option.id} plan={option} period={period} />
            ))}
        </Flex>
      </StepSection>
    </span>
  );
};

export default withPayment(SelectPlan);
