import React from 'react';

import { ModalFooter } from '@/components/Modal';
import CarouselButtons from '@/components/Modal/CarouselButtons';
import Button from '@/componentsV2/Button';
import ImageCarousel from '@/componentsV2/ImageCarousel';
import Tabs from '@/componentsV2/Tabs';
import BubbleText from '@/componentsV2/Text/BubbleText';
import StartAChatButton from '@/containers/Payment/components/StartAChatButton';
import { withPayment } from '@/containers/Payment/context';
import { FadeLeftContainer } from '@/styles/animations/FadeLeft';

import ChatWithUsLink from '../components/ChatWithUsLink';
import {
  Container,
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
  const selectedPlanIndex = Math.max(plans.findIndex((option) => option.id === plan.id), 0);

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
    <Container>
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
              {plan.highlights?.map((highlight, index) => <Highlight key={index}>{highlight}</Highlight>)}
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
    </Container>
  );
}

export default withPayment(PlansDetails);
