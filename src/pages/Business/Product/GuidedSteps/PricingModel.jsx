/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-shadow */
import { AvFeedback, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip } from 'react-tippy';
import { FormGroup } from 'reactstrap';

import Button from '@/components/Button';
import Dropdown from '@/components/Dropdown';
import Input from '@/components/Input';
import SvgIcon from '@/components/SvgIcon';
import { ProductType } from '@/constants';
import { productByIDSelector, updateProduct } from '@/ducks/product';
import { parentCtrlSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { withTargetValue } from '@/utils/dom';

import {
  DropdownWrapper,
  NextButtonContainer,
  RadioButtonGroup,
  RadioButtonLabel,
  SubSection,
  SubscriptionDropdown,
  Text,
  ToggleIcon,
} from './components';

export const TAX_CATEGORIES = [
  { value: 'INFORMATION_SERVICES', label: 'Information Services' },
  { value: 'NEWSPAPERS', label: 'Newspaper' },
  { value: 'PERIODICALS', label: 'Periodicals' },
  { value: 'SOFTWARE', label: 'Software' },
  { value: 'STREAMING_RADIO', label: 'Streaming Radio' },
  { value: 'VIDEO', label: 'Video' },
];

export const PRODUCT_TYPES = [
  { value: ProductType.ENTITLEMENT, label: 'One-Time Purchase' },
  { value: ProductType.CONSUMABLE, label: 'Consumable' },
  { value: ProductType.SUBSCRIPTION, label: 'Subscription' },
];

export const SUBSCRIPTION_OPTIONS = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' },
];

function PricingForm({ product, updateProduct, changeStep, parentCtrl }) {
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
              <FormGroup check key={index}>
                <Tooltip
                  disabled={!(value === ProductType.CONSUMABLE && parentCtrl)}
                  position="top"
                  title={value === ProductType.CONSUMABLE && parentCtrl ? 'Consumables are not available for kid skills at this time.' : null}
                >
                  <RadioButtonLabel disabled={value === ProductType.CONSUMABLE && parentCtrl}>
                    <Input
                      checked={product.type === value}
                      type="radio"
                      name="type"
                      value={value}
                      onChange={onTypeChange(value)}
                      disabled={value === ProductType.CONSUMABLE && parentCtrl}
                    />
                    <span>{label}</span>
                  </RadioButtonLabel>
                </Tooltip>
              </FormGroup>
            ))}
          </RadioButtonGroup>
          <AvFeedback>Type is required</AvFeedback>
        </SubSection>

        {(product.type === ProductType.SUBSCRIPTION || product.type === ProductType.CONSUMABLE) && (
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

            {product.type === ProductType.SUBSCRIPTION && (
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
  parentCtrl: PropTypes.boolean,
  changeStep: PropTypes.func,
  updateProduct: PropTypes.func,
};

const mapStateToProps = {
  product: productByIDSelector,
  parentCtrl: parentCtrlSelector,
};

const mapDispatchToProps = {
  updateProduct,
};

const mergeProps = ({ product: productByIDSelector }, { updateProduct }, { productID }) => ({
  product: productByIDSelector(productID),
  updateProduct: (product) => updateProduct(productID, product),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(PricingForm);
