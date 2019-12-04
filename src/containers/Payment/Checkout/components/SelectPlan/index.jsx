import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import Flex from '@/componentsV2/Flex';
import StepSection from '@/containers/Payment/components/Section';
import { withPayment } from '@/containers/Payment/context';

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
          {plans.map((option) => (
            <PlanOptionCard key={option.id} plan={option} active={plan.id === option.id} selectPlan={setPlan} period={period} />
          ))}
        </Flex>
      </StepSection>
    </>
  );
}

export default withPayment(SelectPlan);
