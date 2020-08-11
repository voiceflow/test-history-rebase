import React from 'react';

import Flex from '@/components/Flex';
import SvgIcon from '@/components/SvgIcon';
import { PLAN_INFO_LINK, PlanType } from '@/constants';
import StepSection from '@/pages/Payment/components/Section';
import { withPayment } from '@/pages/Payment/context';

import StepHeading from '../StepHeading';
import PlanInfoCard from './PlanInfoCard';

function SelectPlan({
  payment: {
    state: { plans, plan, period },
    actions: { setPlan },
  },
}) {
  return (
    <>
      <StepHeading
        heading="UPGRADE PLAN"
        actions={[
          {
            label: (
              <>
                See what's included
                <SvgIcon size={12} icon="next" style={{ display: 'inline-block', marginLeft: 7, marginBottom: -2 }} />
              </>
            ),
            action: () => window.open(PLAN_INFO_LINK, '_blank'),
          },
        ]}
      />
      <StepSection>
        <Flex>
          {plans
            .filter(({ id }) => id !== PlanType.ENTERPRISE || id !== PlanType.OLD_ENTERPRISE)
            .map((option) => (
              <PlanInfoCard key={option.id} plan={option} active={plan.id === option.id} selectPlan={setPlan} period={period} />
            ))}
        </Flex>
      </StepSection>
    </>
  );
}

export default withPayment(SelectPlan);
