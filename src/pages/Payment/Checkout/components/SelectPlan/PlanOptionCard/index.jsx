import React from 'react';

import BubbleText from '@/components/BubbleText';
import { PLAN_NAMES } from '@/constants';

import { Container, Description, Price, PriceContainer, PriceDescription, SelectBox } from './components';

function PlanOptionCard({ plan, active, selectPlan, period }) {
  const { cardSummary, pricing, color, name, id } = plan;
  const price = pricing?.[period]?.price / 100 || null;

  return (
    <Container active={active} color={color} onClick={() => selectPlan(plan)}>
      <SelectBox checked={active} color={active ? color : '#8DA2B5'} readOnly />
      <BubbleText color={PLAN_NAMES[id].color}>{name}</BubbleText>
      <Description>{cardSummary}</Description>
      <PriceContainer>
        {price && <Price>${price}</Price>}
        <PriceDescription>{price ? 'Per Editor / Per Month' : 'Contact Us'}</PriceDescription>
      </PriceContainer>
    </Container>
  );
}

export default PlanOptionCard;
