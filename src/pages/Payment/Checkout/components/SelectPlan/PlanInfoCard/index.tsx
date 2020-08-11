import React from 'react';

import BubbleText from '@/components/BubbleText';
import { FlexApart } from '@/components/Flex';
import { BillingPeriod, PLAN_TYPE_META, PlanType } from '@/constants';

import {
  Container,
  FeatureItem,
  FeatureListColumn,
  FeatureListContainer,
  PlanCostContainer,
  PlanHeadingContainer,
  PlanNameContainer,
} from './components';

type PlanInfoCardProps = {
  plan: {
    pricing: any;
    highlights: string[];
    name: string;
    id: PlanType;
  };
  period: BillingPeriod;
};

const PlanInfoCard: React.FC<PlanInfoCardProps> = ({ plan, period }) => {
  const { pricing, highlights, name, id } = plan;
  const price = pricing?.[period]?.price / 100 || null;
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
            {leftSideHighlights.map((highlight: string, index: number) => {
              return <FeatureItem key={`left-${index}`}>{highlight}</FeatureItem>;
            })}
          </FeatureListColumn>
          <FeatureListColumn>
            {rightSideHighlights.map((highlight: string, index: number) => {
              return <FeatureItem key={`right-${index}`}>{highlight}</FeatureItem>;
            })}
          </FeatureListColumn>
        </FlexApart>
      </FeatureListContainer>
    </Container>
  );
};

export default PlanInfoCard;
