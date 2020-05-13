import React from 'react';

import BubbleText from '@/components/BubbleText';
import { FeatureFlag } from '@/config/features';
import { UNLIMITED_SEAT_NUMBER } from '@/constants';
import { useFeature } from '@/hooks';

import { Container, Description, EditorLimitText, Price, PriceContainer, PriceDescription, SelectBox } from './styled';

function PlanOptionCard({ plan, active, selectPlan, period }) {
  const { cardSummary, pricing, color, name, summary, editorLimit } = plan;
  const price = pricing?.[period]?.price / 100 || null;
  const { isEnabled: NewPricingEnabled } = useFeature(FeatureFlag.PRICING_REVISIONS);
  const cardSum = NewPricingEnabled ? cardSummary : summary;

  return (
    <Container active={active} color={color} onClick={() => selectPlan(plan)}>
      <SelectBox checked={active} color={active ? color : '#8DA2B5'} readOnly />
      <BubbleText color={color}>{name}</BubbleText>
      <Description>{cardSum}</Description>
      {!NewPricingEnabled && editorLimit !== UNLIMITED_SEAT_NUMBER && <EditorLimitText>Up to {editorLimit} editors</EditorLimitText>}
      <PriceContainer>
        {price && <Price>${price}</Price>}
        <PriceDescription>{price ? 'Per Editor / Per Month' : 'Contact Us'}</PriceDescription>
      </PriceContainer>
    </Container>
  );
}

export default PlanOptionCard;
