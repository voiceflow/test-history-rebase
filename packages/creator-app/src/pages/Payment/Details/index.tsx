import { PlanType } from '@voiceflow/internal';
import { Button, ButtonVariant, Modal } from '@voiceflow/ui';
import React from 'react';

import BubbleText from '@/components/BubbleText';
import ImageCarousel from '@/components/ImageCarousel';
import Tabs from '@/components/Tabs';
import { upgradeToEnterpriseAction } from '@/config/planLimits';
import { PLAN_TYPE_META } from '@/constants';
import { PaymentContextProps, withPayment } from '@/pages/Payment/context';
import { FadeLeftContainer } from '@/styles/animations';

import CarouselButtons from './CarouselButtons';
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

const modulo = (a: number, b: number) => ((a % b) + b) % b;

interface PlansDetailsProps {
  payment: PaymentContextProps;
}

const PlansDetails: React.OldFC<PlansDetailsProps> = ({
  payment: {
    state: { plan, plans },
    actions: { showCheckout, setPlan },
  },
}) => {
  const selectedPlanIndex = Math.max(
    plans.findIndex((option) => option.id === plan.id),
    0
  );

  const setPlanIndex = (index: number) => {
    setPlan(plans[modulo(index, plans.length)]);
  };

  const selectPlan = (planId: PlanType) => {
    const selectedPlanObject = plans.filter((plan) => plan.id === planId)[0];
    setPlan(selectedPlanObject);
  };

  const tabsOptions = React.useMemo(
    () =>
      plans
        .filter(({ id }) => id !== PlanType.ENTERPRISE && id !== PlanType.OLD_ENTERPRISE)
        .map((option) => {
          const price = option.pricing?.YR?.price;
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
        }),
    []
  );
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
            <BubbleText color={PLAN_TYPE_META[plan.id].color}>{plan.name}</BubbleText>
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

      <Modal.Footer justifyContent="flex-end">
        {plan.pricing ? (
          <Button variant={ButtonVariant.PRIMARY} onClick={showCheckout}>
            Upgrade to {plan.name}
          </Button>
        ) : (
          <Button variant={ButtonVariant.PRIMARY} onClick={upgradeToEnterpriseAction}>
            Contact Sales
          </Button>
        )}
      </Modal.Footer>
    </div>
  );
};

export default withPayment(PlansDetails);
