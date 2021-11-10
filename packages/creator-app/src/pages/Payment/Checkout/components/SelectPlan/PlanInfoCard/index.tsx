import { BillingPeriod } from '@voiceflow/internal';
import { FlexApart } from '@voiceflow/ui';
import React from 'react';

import BubbleText from '@/components/BubbleText';
import { PLAN_TYPE_META } from '@/constants';
import { PaymentPlan } from '@/pages/Payment/context';

import {
  Container,
  FeatureItem,
  FeatureListColumn,
  FeatureListContainer,
  PlanCostContainer,
  PlanHeadingContainer,
  PlanNameContainer,
} from './components';

export interface PlanInfoCardProps {
  plan: PaymentPlan;
  period: BillingPeriod;
}

const PlanInfoCard: React.FC<PlanInfoCardProps> = ({ plan, period }) => {
  const { pricing, highlights, name, id } = plan;
  const price = (pricing[period]?.price ?? 0) / 100 || null;
  const halfLength = highlights.length / 2;
  const leftSideHighlights = React.useMemo(() => highlights.splice(0, halfLength), [highlights]);
  const rightSideHighlights = React.useMemo(() => highlights, [highlights]);

  return (
    <Container>
      <PlanHeadingContainer>
        <BubbleText color={PLAN_TYPE_META[id].color}>{name}</BubbleText>
        <PlanNameContainer>Voiceflow {name} </PlanNameContainer>
        <PlanCostContainer>- ${price} per editor, per month</PlanCostContainer>
      </PlanHeadingContainer>
      <FeatureListContainer>
        <FlexApart>
          <FeatureListColumn>
            {leftSideHighlights.map((highlight: string, index: number) => (
              <FeatureItem key={`left-${index}`}>{highlight}</FeatureItem>
            ))}
          </FeatureListColumn>
          <FeatureListColumn>
            {rightSideHighlights.map((highlight: string, index: number) => (
              <FeatureItem key={`right-${index}`}>{highlight}</FeatureItem>
            ))}
          </FeatureListColumn>
        </FlexApart>
      </FeatureListContainer>
    </Container>
  );
};

export default PlanInfoCard;
