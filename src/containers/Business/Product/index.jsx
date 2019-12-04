/* eslint-disable default-case */
/* eslint-disable no-shadow */
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import GuidedSteps from '@/components/GuidedSteps';
import SvgIcon from '@/components/SvgIcon';
import { NEW_PRODUCT_ID } from '@/constants';
import * as Product from '@/ducks/product';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { compose } from '@/utils/functional';

import { BackButtonContainer, BackLink } from '../components';
import { AvailabilityForm, DescriptionForm, DetailsForm, IconsForm, PhrasesForm, PricingModelForm } from './GuidedSteps';
import { DescriptionSection, PurchasePromptPopover } from './components';

class ProductEditPage extends PureComponent {
  state = {
    step: 0,
  };

  getBlocks = () =>
    this.props.product.id
      ? [
          {
            title: 'Name & Description',
            content: <DescriptionForm productID={this.props.productID} changeStep={() => this.setState({ step: 1 })} />,
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
            content: <PricingModelForm productID={this.props.productID} changeStep={() => this.setState({ step: 2 })} />,
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
            content: <AvailabilityForm productID={this.props.productID} changeStep={() => this.setState({ step: 3 })} />,
            description: (
              <>
                <DescriptionSection>
                  Choose which countries and regions to distribute your in-skill product. To make product available for the marketplace, the skill
                  must also support the respective region (e.g. Skill must support Japanese (JP) to make in-skill product available for AMAZON.CO.JP).
                  Each marketplace has minimum and maximum prices.
                </DescriptionSection>
              </>
            ),
          },
          {
            title: 'Phrases',
            content: <PhrasesForm productID={this.props.productID} changeStep={() => this.setState({ step: 4 })} />,
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
            content: <IconsForm productID={this.props.productID} changeStep={() => this.setState({ step: 5 })} />,
            description: (
              <>
                <DescriptionSection>Use an image with 108x108 pixel resolution for Small icons and 512x512 pixel for Large icons.</DescriptionSection>
                <DescriptionSection>Images with higher resolution will be resized automatically to fit the format.</DescriptionSection>
              </>
            ),
          },
          {
            title: 'Details',
            content: <DetailsForm productID={this.props.productID} onSave={this.props.goToProducts} />,
            description: (
              <>
                <DescriptionSection>
                  <span>Keywords</span> - simple search words that relate to or describe this product. This helps customers find the product quickly
                  and easily. Use commas in between each search term. Up to 30 keywords can be added. Each string in the list can be 1-150 characters
                  long.
                </DescriptionSection>
                <DescriptionSection>
                  <span>In-App Card Description</span> - a description of the product that displays on the skill card in the Alexa app. Include the
                  product name and any unique details about product.
                </DescriptionSection>
                <DescriptionSection>
                  <span>Purchase Prompt</span> - the description of the product a customer hears when making a purchase or when they cancel a
                  subscription. Do not include any pricing information as Amazon automatically appends the price in the purchase flow.
                </DescriptionSection>
                <DescriptionSection>
                  In case of one-time purchase Alexa will provide the purchase prompt text and price before confirming the purchase.
                </DescriptionSection>
                <PurchasePromptPopover />
              </>
            ),
          },
        ]
      : [];

  render() {
    const { goToProducts } = this.props;
    const { step } = this.state;

    return (
      <>
        <BackButtonContainer>
          <BackLink onClick={goToProducts}>
            <SvgIcon icon="arrowLeft" color="currentColor" />
            Back to Products
          </BackLink>
        </BackButtonContainer>

        <GuidedSteps
          blocks={this.getBlocks()}
          submitText="Save Locale"
          step={step}
          checkStep={this.checkValidStep}
          setStage={(nextStep) => this.setState({ step: nextStep })}
          haveFooter
        />
      </>
    );
  }

  componentDidMount() {
    const {
      createProduct,
      match: {
        params: { id },
      },
    } = this.props;
    if (id === NEW_PRODUCT_ID) {
      createProduct();
    }
  }

  componentWillUnmount() {
    const { product, uploadProduct, cancelProduct } = this.props;

    product.name && product.summary ? uploadProduct() : cancelProduct();
  }

  // eslint-disable-next-line consistent-return
  checkValidStep = (step) => {
    const { product } = this.props;

    switch (step) {
      case 0:
        return !!(product.name && product.summary);
      case 1:
        if (product.type === 'SUBSCRIPTION') {
          return !!(product.subscriptionFrequency && product.trialPeriodDays && product.taxCategory);
        }
        return !!product.taxCategory;

      case 2:
        return Object.keys(product.marketPlaces).length > 0;
      case 3:
        return product.phrases.length > 0;
      case 4:
        return !!(product.smallIconUri && product.largeIconUri);
      case 5:
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
}

ProductEditPage.propTypes = {
  goToProducts: PropTypes.func,
  product: PropTypes.object,
  productID: PropTypes.string,
  uploadProduct: PropTypes.func,
  match: PropTypes.object,
};

const mapStateToProps = {
  product: Product.productByIDSelector,
};

const mapDispatchToProps = {
  goToProducts: Router.goToProducts,
  createProduct: Product.createProduct,
  cancelProduct: Product.cancelProduct,
  uploadProduct: Product.uploadProduct,
};

const mergeProps = ({ product: productByIDSelector }, { goToProducts, uploadProduct }, { match, skillID }) => {
  const productID = match.params.id;

  return {
    productID,
    product: productByIDSelector(productID) || {},
    goToProducts: () => goToProducts(skillID),
    uploadProduct: () => uploadProduct(productID),
  };
};

export default compose(
  React.memo,
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )
)(ProductEditPage);
