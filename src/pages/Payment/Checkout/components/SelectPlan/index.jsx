import React from 'react';

import Flex from '@/components/Flex';
import SvgIcon from '@/components/SvgIcon';
import { PLANS } from '@/constants';
import StepSection from '@/pages/Payment/components/Section';
import { withPayment } from '@/pages/Payment/context';

import StepHeading from '../StepHeading';
import PlanOptionCard from './PlanOptionCard';

function SelectPlan({
  payment: {
    state: { plans, plan, period },
    actions: { setPlan, showDetails },
  },
}) {
  return (
    <>
      <StepHeading
        heading="1. Select plan"
        actions={[
          {
            label: (
              <>
                See what's included
                <SvgIcon size={12} icon="next" style={{ display: 'inline-block', marginLeft: 7, marginBottom: -2 }} />
              </>
            ),
            action: showDetails,
          },
        ]}
      />
      <StepSection>
        <Flex>
          {plans
            .filter(({ id }) => id !== PLANS.enterprise)
            .map((option) => (
              <PlanOptionCard key={option.id} plan={option} active={plan.id === option.id} selectPlan={setPlan} period={period} />
            ))}
        </Flex>
      </StepSection>
    </>
  );
}

export default withPayment(SelectPlan);
