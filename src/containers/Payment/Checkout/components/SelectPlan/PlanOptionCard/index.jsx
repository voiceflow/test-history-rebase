import React from 'react';

import BubbleText from '@/componentsV2/Text/BubbleText';

import { Container, Description, Price, PriceContainer, PriceDescription, SelectBox } from './styled';

function PlanOptionCard({ plan, active, selectPlan, period }) {
  const { summary, pricing, color, name } = plan;
  const price = pricing?.[period]?.price / 100 || null;

  return (
    <Container active={active} color={color} onClick={() => selectPlan(plan)}>
      <SelectBox checked={active} color={active ? color : '#8DA2B5'} readOnly />
      <BubbleText color={color}>{name}</BubbleText>
      <Description>{summary}</Description>
      <PriceContainer>
        {price && <Price>${price}</Price>}
        <PriceDescription>{price ? 'seat/month' : 'Contact Us'}</PriceDescription>
      </PriceContainer>
    </Container>
  );
}

export default PlanOptionCard;
