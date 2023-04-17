/* eslint-disable default-case */
import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import GuidedSteps from '@/components/GuidedSteps';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useCurried, useDispatch, useSelector } from '@/hooks';

import { BackButtonContainer, BackLink, DescriptionSection } from '../components';
import { ProductContext } from '../contexts';
import { ProductStep } from './constants';
import { AvailabilityForm, DescriptionForm, DetailsForm, IconsForm, PhrasesForm, PricingModelForm } from './GuidedSteps';

export const isProductValid = (step: ProductStep, product: Realtime.Product) => {
  switch (step) {
    case ProductStep.DESCRIPTION:
      return !!(product.name && product.summary);
    case ProductStep.PRICING:
      if (product.type === 'SUBSCRIPTION') {
        return !!(product.subscriptionFrequency && product.trialPeriodDays && product.taxCategory);
      }
      return !!product.taxCategory;
    case ProductStep.AVAILABILITY:
      return Object.keys(product.marketPlaces).length > 0;
    case ProductStep.PHRASES:
      return product.phrases.length > 0;
    case ProductStep.IMAGES:
      return !!(product.smallIconUri && product.largeIconUri);
    case ProductStep.DETAILS:
      return !!(
        product.keywords &&
        product.keywords.length > 0 &&
        product.largeIconUri &&
        product.cardDescription &&
        product.purchasePrompt &&
        product.privacyPolicyUrl &&
        product.testingInstructions
      );
  }
};

const ProductEditPage: React.FC = () => {
  const { product } = React.useContext(ProductContext)!;
  const [step, setStep] = React.useState(ProductStep.DESCRIPTION);
  const versionID = useSelector(Session.activeVersionIDSelector)!;

  const goToProducts = useDispatch(Router.goToProducts, versionID);

  const checkValidStep = React.useCallback(() => isProductValid(step, product), [step, product]);
  const changeStep = useCurried(setStep, []);

  const steps = React.useMemo(
    () => [
      {
        title: 'Name & Description',
        content: <DescriptionForm advanceStep={changeStep(ProductStep.PRICING)} />,
        description: (
          <>
            <DescriptionSection>Tell us how the product should appear to your customers.</DescriptionSection>
            <DescriptionSection>
              The product name is included in purchase confirmation prompts, Alexa app purchasing cards and email receipts.
            </DescriptionSection>
          </>
        ),
      },
      {
        title: 'Pricing Model',
        content: <PricingModelForm advanceStep={changeStep(ProductStep.AVAILABILITY)} />,
        description: (
          <>
            <DescriptionSection>The skill can contain only one subscription product.</DescriptionSection>
            <DescriptionSection>
              You will be paid 70% of the price (Amazon takes 30% commission), before any discount offered by Amazon.
            </DescriptionSection>
            <DescriptionSection>
              For example, if the list price is $2.00, you'll receive $1.40 (70%) even if the customer receives a discount from Amazon.
            </DescriptionSection>
          </>
        ),
      },
      {
        title: 'Availability',
        content: <AvailabilityForm advanceStep={changeStep(ProductStep.PHRASES)} />,
        description: (
          <>
            <DescriptionSection>
              Choose which countries and regions to distribute your in-skill product. To make product available for the marketplace, the skill must
              also support the respective region (e.g. Skill must support Japanese (JP) to make in-skill product available for AMAZON.CO.JP). Each
              marketplace has minimum and maximum prices.
            </DescriptionSection>
          </>
        ),
      },
      {
        title: 'Phrases',
        content: <PhrasesForm advanceStep={changeStep(ProductStep.IMAGES)} />,
        description: (
          <>
            <DescriptionSection>
              These phrases will help users get started and enable them to access your skill's products. Up to 3 entries can be added.
            </DescriptionSection>
          </>
        ),
      },
      {
        title: 'Product Icons',
        content: <IconsForm advanceStep={changeStep(ProductStep.DETAILS)} />,
        description: (
          <>
            <DescriptionSection>Use an image with 108x108 pixel resolution for Small icons and 512x512 pixel for Large icons.</DescriptionSection>
            <DescriptionSection>Images with higher resolution will be resized automatically to fit the format.</DescriptionSection>
          </>
        ),
      },
      {
        title: 'Details',
        content: <DetailsForm onSave={goToProducts} />,
        description: (
          <>
            <DescriptionSection>
              <span>Keywords</span> - simple search words that relate to or describe this product. This helps customers find the product quickly and
              easily. Use commas in between each search term. Up to 30 keywords can be added. Each string in the list can be 1-150 characters long.
            </DescriptionSection>
            <DescriptionSection>
              <span>In-App Card Description</span> - a description of the product that displays on the skill card in the Alexa app. Include the
              product name and any unique details about product.
            </DescriptionSection>
          </>
        ),
      },
    ],
    []
  );

  return (
    <>
      <BackButtonContainer>
        <BackLink onClick={goToProducts}>
          <SvgIcon icon="arrowLeft" color="currentColor" />
          Back to Products
        </BackLink>
      </BackButtonContainer>

      <GuidedSteps blocks={steps} step={step} checkStep={checkValidStep} onChangeStep={setStep} haveFooter>
        {({ disabled, submit }) => (
          <Button disabled={disabled} onClick={() => submit()}>
            Save Locale
          </Button>
        )}
      </GuidedSteps>
    </>
  );
};

export default React.memo(ProductEditPage);
