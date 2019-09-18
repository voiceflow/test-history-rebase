import { AvFeedback, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { FormGroup, Input } from 'reactstrap';

import Button from '@/componentsV2/Button';
import Dropdown from '@/componentsV2/Dropdown';
import { TAX_CATEGORY, updateProduct } from '@/ducks/product';

import { NextContainer, SubscriptionDropdown } from './components';
import { RadioButtonGroup, RadioButtonLabel, SubSection, Text } from './styled';

const TYPE = [
  { value: 'ENTITLEMENT', label: 'One-Time Purchase' },
  { value: 'CONSUMABLE', label: 'Consumable' },
  { value: 'SUBSCRIPTION', label: 'Subscription' },
];

const SUBSCRIPTION = [{ value: 'MONTHLY', label: 'Monthly' }, { value: 'YEARLY', label: 'Yearly' }];

function PricingForm({ product, updateProduct, changeStep }) {
  const onTypeChange = (value) => () => {
    updateProduct({
      ...product,
      type: value,
    });
  };

  const onChange = (key) => (e) => {
    updateProduct({
      ...product,
      [key]: e.target ? e.target.value : e,
    });
  };

  return (
    <AvForm onValidSubmit={changeStep}>
      <AvGroup>
        <SubSection>
          <label>Product Type</label>
          <RadioButtonGroup>
            {TYPE.map(({ value, label }, index) => (
              <FormGroup check key={index}>
                <RadioButtonLabel>
                  <Input checked={product.type === value} type="radio" name="type" value={value} onChange={onTypeChange(value)} />
                  {label}
                </RadioButtonLabel>
              </FormGroup>
            ))}
          </RadioButtonGroup>
          <AvFeedback>Type is required</AvFeedback>
        </SubSection>

        {(product.type === 'SUBSCRIPTION' || product.type === 'CONSUMABLE') && (
          <SubSection>
            <label>Bill Customer</label>
            {product.type === 'CONSUMABLE' && (
              <SubSection flex>
                <AvInput
                  className="form-bg small_input"
                  name="units"
                  type="number"
                  placeholder="0 unit min"
                  value={product.consumableUnit}
                  onChange={onChange('consumableUnit')}
                />
                <Text>per each purchase</Text>
              </SubSection>
            )}
            {product.type === 'SUBSCRIPTION' && (
              <SubSection flex>
                <SubscriptionDropdown>
                  <Dropdown
                    value={
                      SUBSCRIPTION.find(({ value }) => value === product.subscriptionFrequency) &&
                      SUBSCRIPTION.find(({ value }) => value === product.subscriptionFrequency).label
                    }
                    onSelect={onChange('subscriptionFrequency')}
                    options={SUBSCRIPTION}
                  />
                </SubscriptionDropdown>
                <Text>with the trial priod of</Text>
                <AvInput
                  className="form-bg small_input"
                  name="days"
                  placeholder={product.trialPeriodDays || 0}
                  value={product.trialPeriodDays}
                  onChange={onChange('trialPeriodDays')}
                />
                <Text>days</Text>
              </SubSection>
            )}
          </SubSection>
        )}

        <SubSection>
          <label>Tax Category</label>
          <Dropdown
            size="50%"
            value={
              TAX_CATEGORY.find(({ value }) => value === product.taxCategory) && TAX_CATEGORY.find(({ value }) => value === product.taxCategory).label
            }
            onSelect={onChange('taxCategory')}
            options={TAX_CATEGORY}
          />
        </SubSection>
      </AvGroup>
      <NextContainer>
        <Button variant="secondary">Next</Button>
      </NextContainer>
    </AvForm>
  );
}

PricingForm.proptypes = {
  product: PropTypes.object,
  changeStep: PropTypes.func,
  updateProduct: PropTypes.func,
};

const mapDispatchToProps = {
  updateProduct,
};

export default connect(
  null,
  mapDispatchToProps
)(PricingForm);
