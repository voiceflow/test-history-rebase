import React from 'react';

import Button from '@/components/Button';
import ImageCarousel from '@/components/ImageCarousel';
import { ModalFooter } from '@/components/LegacyModal';
import CarouselButtons from '@/components/LegacyModal/CarouselButtons';
import Tabs from '@/components/Tabs';
import BubbleText from '@/components/Text/BubbleText';
import StartAChatButton from '@/pages/Payment/components/StartAChatButton';
import { withPayment } from '@/pages/Payment/context';
import { FadeLeftContainer } from '@/styles/animations/FadeLeft';

import ChatWithUsLink from '../components/ChatWithUsLink';
import {
  ContentContainer,
  DetailsSection,
  DollarText,
  Headline,
  Highlight,
  HighlightsText,
  ImagesContainer,
  LeftSection,
  PlanDescription,
  PlanTypeBubbleContainer,
  RightSection,
  TabContainer,
  TabPriceContainer,
  TabsContainer,
} from './components';

const modulo = (a, b) => {
  return ((a % b) + b) % b;
};

function PlansDetails({
  payment: {
    state: { plan, plans },
    actions: { showCheckout, setPlan },
  },
}) {
  const selectedPlanIndex = Math.max(
    plans.findIndex((option) => option.id === plan.id),
    0
  );

  const setPlanIndex = (index) => {
    setPlan(plans[modulo(index, plans.length)]);
  };

  const selectPlan = (planId) => {
    const selectedPlanObject = plans.filter((plan) => {
      return plan.id === planId;
    })[0];
    setPlan(selectedPlanObject);
  };

  const tabsOptions = React.useMemo(() => {
    return plans.map((option) => {
      const price = option.pricing?.MO?.price;
      const dollarPrice = price ? price / 100 : null;
      return {
        value: option.id,
        label: (
          <TabContainer>
            {option.name}
            {dollarPrice ? (
              <TabPriceContainer>
                <DollarText>${dollarPrice}</DollarText>
                /mo
              </TabPriceContainer>
            ) : (
              <TabPriceContainer>Custom </TabPriceContainer>
            )}
          </TabContainer>
        ),
        color: option.color,
      };
    });
  });

  return (
    <div>
      <CarouselButtons
        onLeftClick={() => setPlanIndex(selectedPlanIndex - 1)}
        onRightClick={() => setPlanIndex(selectedPlanIndex + 1)}
        disableLeft={selectedPlanIndex === 0}
        disableRight={selectedPlanIndex === plans.length - 1}
      />
      <ContentContainer>
        <TabsContainer>
          <Tabs options={tabsOptions} onChange={selectPlan} selected={plan.id} />
        </TabsContainer>

        <FadeLeftContainer>
          <ImagesContainer>
            <ImageCarousel imageURLs={plan.images} />
          </ImagesContainer>

          <PlanTypeBubbleContainer>
            <BubbleText color={plan.color}>{plan.name}</BubbleText>
          </PlanTypeBubbleContainer>
          <DetailsSection>
            <LeftSection>
              <Headline>{plan.summary}</Headline>
              <PlanDescription>{plan.description}</PlanDescription>
            </LeftSection>
            <RightSection>
              <HighlightsText>HIGHLIGHTS</HighlightsText>
              {plan.highlights?.map((highlight, index) => (
                <Highlight key={index}>{highlight}</Highlight>
              ))}
            </RightSection>
          </DetailsSection>
        </FadeLeftContainer>
      </ContentContainer>

      <ModalFooter justifyContent="space-between">
        <ChatWithUsLink />
        {plan.pricing ? (
          <Button variant="primary" onClick={showCheckout}>
            Upgrade to {plan.name}
          </Button>
        ) : (
          <StartAChatButton />
        )}
      </ModalFooter>
    </div>
  );
}

export default withPayment(PlansDetails);
