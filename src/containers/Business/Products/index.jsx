import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import GuidedSteps from '@/components/GuidedSteps';
import SvgIcon from '@/components/SvgIcon';
import { NEW_PRODUCT_ID, addProduct, cancelProduct, uploadProduct } from '@/ducks/product';
import { getSelectedLocales } from '@/ducks/utils';

import { AvailabilityForm, DescriptionForm, DetailsForm, IconsForm, PhrasesForm, PricingModelForm } from './GuidedSteps';
import PurchasePromptPopover from './components/DescriptionPopover';
import { BackButtonContainer, BackLink, DescriptionSection } from './components/styled';

class ProductEditPage extends PureComponent {
  state = {
    step: 0,
  };

  getLocale = () => Object.keys(this.props.product.locales)[0];

  getBlocks = () =>
    this.props.product.id
      ? [
          {
            title: 'Name & Description',
            content: <DescriptionForm product={this.props.product} locale={this.getLocale()} changeStep={() => this.setState({ step: 1 })} />,
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
            content: <PricingModelForm product={this.props.product} locale={this.getLocale()} changeStep={() => this.setState({ step: 2 })} />,
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
            content: <AvailabilityForm product={this.props.product} locale={this.getLocale()} changeStep={() => this.setState({ step: 3 })} />,
            description: (
              <>
                <DescriptionSection>
                  Choose which countries and regions to distribute your in-skill product. Each marketplace has minimum and maximum prices.
                </DescriptionSection>
              </>
            ),
          },
          {
            title: 'Phrases',
            content: <PhrasesForm product={this.props.product} locale={this.getLocale()} changeStep={() => this.setState({ step: 4 })} />,
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
            content: <IconsForm product={this.props.product} locale={this.getLocale()} changeStep={() => this.setState({ step: 5 })} />,
            description: (
              <>
                <DescriptionSection>Use an image with 108x108 pixel resolution for Small icons and 512x512 pixel for Large icons.</DescriptionSection>
                <DescriptionSection>Images with higher resolution will be resized automatically to fit the format.</DescriptionSection>
              </>
            ),
          },
          {
            title: 'Details',
            content: <DetailsForm product={this.props.product} locale={this.getLocale()} onSave={this.props.goToProducts} />,
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
    const { step } = this.state;

    return (
      <>
        <BackButtonContainer>
          <BackLink to={`/tools/${this.props.skill.skill_id}/products`}>
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
      addProduct,
      computedMatch: {
        params: { id },
      },
      skill,
    } = this.props;

    if (id === NEW_PRODUCT_ID) {
      addProduct(getSelectedLocales(skill.locales)[0].value);
    }
  }

  componentWillUnmount() {
    const { product, skill, uploadProduct, cancelProduct } = this.props;

    product.name ? uploadProduct(product, skill) : cancelProduct();
  }

  checkValidStep = (step) => {
    const { product, skill } = this.props;

    if (step === 0) {
      return !!product.name && !!product.locales[getSelectedLocales(skill.locales)[0].value].summary;
    }
  };
}

ProductEditPage.proptypes = {
  goToProducts: PropTypes.func,
  addProduct: PropTypes.func,
  uploadProduct: PropTypes.func,
  product: PropTypes.object,
  skill: PropTypes.object,
  history: PropTypes.object,
  computedMatch: PropTypes.object,
  ispLocales: PropTypes.array,
};

const mapStateToProps = ({ products }) => ({
  products: products.products,
});

const mapDispatchToProps = (dispatch) => ({
  addProduct: (locales) => dispatch(addProduct(locales)),
  uploadProduct: (product, skill) => dispatch(uploadProduct(product, skill)),
  cancelProduct: () => dispatch(cancelProduct()),
});

const mergeProps = ({ products }, { addProduct, uploadProduct, cancelProduct }, otherProps) => {
  const productID = otherProps.computedMatch.params.id;

  return {
    product: products.find(({ id }) => id === NEW_PRODUCT_ID || id === parseInt(productID, 10)) || {},
    goToProducts: () => otherProps.history.push(`/tools/${otherProps.skill_id}/products`),
    uploadProduct: (product) => uploadProduct(product, otherProps.skill),
    addProduct,
    cancelProduct,
    ...otherProps,
  };
};

export default React.memo(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(ProductEditPage)
);
