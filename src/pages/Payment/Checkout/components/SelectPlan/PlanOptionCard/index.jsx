import React from 'react';

import BubbleText from '@/components/Text/BubbleText';
import { UNLIMITED_SEAT_NUMBER } from '@/constants';

import { Container, Description, EditorLimitText, Price, PriceContainer, PriceDescription, SelectBox } from './styled';

function PlanOptionCard({ plan, active, selectPlan, period }) {
  const { summary, pricing, color, name, editorLimit } = plan;
  const price = pricing?.[period]?.price / 100 || null;

  return (
    <Container active={active} color={color} onClick={() => selectPlan(plan)}>
      <SelectBox checked={active} color={active ? color : '#8DA2B5'} readOnly />
      <BubbleText color={color}>{name}</BubbleText>
      <Description>{summary}</Description>
      {editorLimit !== UNLIMITED_SEAT_NUMBER && <EditorLimitText>Up to {editorLimit} editors</EditorLimitText>}

      <PriceContainer>
        {price && <Price>${price}</Price>}
        <PriceDescription>{price ? 'Per Editor / Per Month' : 'Contact Us'}</PriceDescription>
      </PriceContainer>
    </Container>
  );
}

export default PlanOptionCard;
