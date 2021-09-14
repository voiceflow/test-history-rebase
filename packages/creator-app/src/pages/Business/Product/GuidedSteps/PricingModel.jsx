/* eslint-disable jsx-a11y/label-has-for, jsx-a11y/label-has-associated-control */
import { Constants } from '@voiceflow/alexa-types';
import { Button, Dropdown, Input, SvgIcon } from '@voiceflow/ui';
import { AvFeedback, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip } from 'react-tippy';

import * as Product from '@/ducks/product';
import * as Version from '@/ducks/version';
import { connect } from '@/hocs';
import { withTargetValue } from '@/utils/dom';

import {
  DropdownWrapper,
  NextButtonContainer,
  RadioButtonGroup,
  RadioButtonLabel,
  SubscriptionDropdown,
  SubSection,
  Text,
  ToggleIcon,
} from './components';

export const TAX_CATEGORIES = [
  { value: 'INFORMATION_SERVICES', label: 'Information Services' },
  { value: 'NEWSPAPERS', label: 'Newspaper' },
  { value: 'PERIODICALS', label: 'Periodicals' },
  { value: 'SOFTWARE', label: 'Software' },
  { value: 'STREAMING_AUDIO', label: 'Streaming Audio' },
  { value: 'STREAMING_RADIO', label: 'Streaming Radio' },
  { value: 'VIDEO', label: 'Video' },
];

export const PRODUCT_TYPES = [
  { value: Constants.ProductType.ENTITLEMENT, label: 'One-Time Purchase' },
  { value: Constants.ProductType.CONSUMABLE, label: 'Consumable' },
  { value: Constants.ProductType.SUBSCRIPTION, label: 'Subscription' },
];

export const SUBSCRIPTION_OPTIONS = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' },
];

function PricingForm({ product, updateProduct, changeStep, parentalControl }) {
  const onTypeChange = (value) => () => {
    updateProduct({
      ...product,
      type: value,
    });
  };

  const onChange = (key) => (value) => {
    updateProduct({
      ...product,
      [key]: value,
    });
  };

  return (
    <AvForm onValidSubmit={changeStep}>
      <AvGroup>
        <SubSection>
          <label>Product Type</label>
          <RadioButtonGroup>
            {PRODUCT_TYPES.map(({ value, label }, index) => (
              <div key={index}>
                <Tooltip
                  disabled={!(value === Constants.ProductType.CONSUMABLE && parentalControl)}
                  position="top"
                  title={
                    value === Constants.ProductType.CONSUMABLE && parentalControl
                      ? 'Consumables are not available for kid skills at this time.'
                      : null
                  }
                >
                  <RadioButtonLabel disabled={value === Constants.ProductType.CONSUMABLE && parentalControl}>
                    <Input
                      checked={product.type === value}
                      type="radio"
                      name="type"
                      value={value}
                      onChange={onTypeChange(value)}
                      disabled={value === Constants.ProductType.CONSUMABLE && parentalControl}
                    />
                    <span>{label}</span>
                  </RadioButtonLabel>
                </Tooltip>
              </div>
            ))}
          </RadioButtonGroup>
          <AvFeedback>Type is required</AvFeedback>
        </SubSection>

        {(product.type === Constants.ProductType.SUBSCRIPTION || product.type === Constants.ProductType.CONSUMABLE) && (
          <SubSection>
            <label>Bill Customer</label>
            {product.type === 'CONSUMABLE' && (
              <SubSection flex>
                <AvInput
                  className="form-bg small_input"
                  name="units"
                  type="number"
                  min={0}
                  placeholder="0 unit min"
                  value={product.consumableUnit}
                  onChange={withTargetValue(onChange('consumableUnit'))}
                />
                <Text>per each purchase</Text>
              </SubSection>
            )}

            {product.type === Constants.ProductType.SUBSCRIPTION && (
              <SubSection flex>
                <SubscriptionDropdown>
                  <Dropdown onSelect={onChange('subscriptionFrequency')} options={SUBSCRIPTION_OPTIONS} autoWidth={true}>
                    {(ref, onToggle) => (
                      <DropdownWrapper ref={ref} onClick={onToggle}>
                        <span>
                          {SUBSCRIPTION_OPTIONS.find(({ value }) => value === product.subscriptionFrequency)?.label || <span>Select Options</span>}
                        </span>
                        <ToggleIcon>
                          <SvgIcon icon="caretDown" size={10} color="currentColor" />
                        </ToggleIcon>
                      </DropdownWrapper>
                    )}
                  </Dropdown>
                </SubscriptionDropdown>
                <Text>with the trial priod of</Text>
                <AvInput
                  className="form-bg small_input"
                  name="days"
                  placeholder={product.trialPeriodDays || 0}
                  value={product.trialPeriodDays}
                  onChange={withTargetValue(onChange('trialPeriodDays'))}
                />
                <Text>days</Text>
              </SubSection>
            )}
          </SubSection>
        )}

        <SubSection>
          <label>Tax Category</label>
          <Dropdown onSelect={onChange('taxCategory')} options={TAX_CATEGORIES} autoWidth={true}>
            {(ref, onToggle) => (
              <DropdownWrapper size="50%" ref={ref} onClick={onToggle}>
                <span>{TAX_CATEGORIES.find(({ value }) => value === product.taxCategory)?.label || <span>Select Category</span>}</span>
                <ToggleIcon>
                  <SvgIcon icon="caretDown" size={10} color="currentColor" />
                </ToggleIcon>
              </DropdownWrapper>
            )}
          </Dropdown>
        </SubSection>
      </AvGroup>

      <NextButtonContainer>
        <Button variant="secondary">Next</Button>
      </NextButtonContainer>
    </AvForm>
  );
}

PricingForm.proptypes = {
  product: PropTypes.object,
  parentalControl: PropTypes.boolean,
  changeStep: PropTypes.func,
  updateProduct: PropTypes.func,
};

const mapStateToProps = {
  product: Product.productByIDSelector,
  parentalControl: Version.alexa.parentalControlSelector,
};

const mapDispatchToProps = {
  updateProduct: Product.updateProduct,
};

const mergeProps = ({ product: productByIDSelector }, { updateProduct }, { productID }) => ({
  product: productByIDSelector(productID),
  updateProduct: (product) => updateProduct(productID, product),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(PricingForm);
