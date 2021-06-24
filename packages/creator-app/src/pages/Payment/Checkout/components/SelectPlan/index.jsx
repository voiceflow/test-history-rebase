import { Flex, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { PLAN_INFO_LINK, PlanType } from '@/constants';
import StepSection from '@/pages/Payment/components/Section';
import { withPayment } from '@/pages/Payment/context';
import { Identifier } from '@/styles/constants';

import StepHeading from '../StepHeading';
import PlanInfoCard from './PlanInfoCard';

const SelectPlan = ({
  payment: {
    state: { plans, plan, period },
    actions: { setPlan },
  },
}) => (
  <span id={Identifier.UPGRADE_PLAN_SECTION}>
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
  </span>
);

export default withPayment(SelectPlan);
