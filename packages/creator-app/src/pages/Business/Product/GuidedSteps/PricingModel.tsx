import { Constants, Project } from '@voiceflow/alexa-types';
import { Box, Button, ButtonVariant, Dropdown, Input, Label, SvgIcon } from '@voiceflow/ui';
import React from 'react';
import { Tooltip } from 'react-tippy';

import TextInput from '@/components/Form/TextInput';
import * as VersionV2 from '@/ducks/versionV2';
import { useSelector } from '@/hooks';
import { withTargetValue } from '@/utils/dom';

import { ProductContext } from '../../contexts';
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
  { value: Project.SubscriptionPaymentFrequency.MONTHLY, label: 'Monthly' },
  { value: Project.SubscriptionPaymentFrequency.YEARLY, label: 'Yearly' },
];

export interface PricingFormProps {
  advanceStep: VoidFunction;
}

const PricingForm: React.FC<PricingFormProps> = ({ advanceStep }) => {
  const parentalControl = useSelector(VersionV2.active.alexa.parentalControlSelector);
  const { product, patchProduct, setProductProperty } = React.useContext(ProductContext)!;

  const onTypeChange = (value: Constants.ProductType) => () => {
    patchProduct({ type: value });
  };

  return (
    <Box>
      <Box mb={24}>
        <SubSection>
          <Label>Product Type</Label>
          <RadioButtonGroup>
            {PRODUCT_TYPES.map(({ value, label }, index) => (
              <div key={index}>
                <Tooltip
                  disabled={!(value === Constants.ProductType.CONSUMABLE && parentalControl)}
                  position="top"
                  title={
                    value === Constants.ProductType.CONSUMABLE && parentalControl
                      ? 'Consumables are not available for kid skills at this time.'
                      : undefined
                  }
                >
                  <RadioButtonLabel isDisabled={value === Constants.ProductType.CONSUMABLE && !!parentalControl}>
                    <Input
                      type="radio"
                      name="type"
                      value={value}
                      checked={product.type === value}
                      disabled={value === Constants.ProductType.CONSUMABLE && parentalControl}
                      onChange={onTypeChange(value)}
                    />
                    <span>{label}</span>
                  </RadioButtonLabel>
                </Tooltip>
              </div>
            ))}
          </RadioButtonGroup>
        </SubSection>

        {(product.type === Constants.ProductType.SUBSCRIPTION || product.type === Constants.ProductType.CONSUMABLE) && (
          <SubSection>
            <Label>Bill Customer</Label>
            {product.type === 'CONSUMABLE' && (
              <SubSection flex>
                <TextInput
                  className="form-bg small_input"
                  name="units"
                  type="number"
                  min={0}
                  placeholder="0 unit min"
                  value={product.consumableUnit}
                  onChange={withTargetValue(setProductProperty('consumableUnit'))}
                />
                <Text>per each purchase</Text>
              </SubSection>
            )}

            {product.type === Constants.ProductType.SUBSCRIPTION && (
              <SubSection flex>
                <SubscriptionDropdown>
                  <Dropdown<Project.SubscriptionPaymentFrequency>
                    onSelect={setProductProperty('subscriptionFrequency')}
                    options={SUBSCRIPTION_OPTIONS}
                    autoWidth
                  >
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
                <TextInput
                  className="form-bg small_input"
                  name="days"
                  placeholder={String(product.trialPeriodDays || 0)}
                  value={product.trialPeriodDays}
                  onChange={withTargetValue(setProductProperty('trialPeriodDays'))}
                />
                <Text>days</Text>
              </SubSection>
            )}
          </SubSection>
        )}

        <SubSection>
          <Label>Tax Category</Label>
          <Dropdown onSelect={setProductProperty('taxCategory')} options={TAX_CATEGORIES} autoWidth selfDismiss>
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
      </Box>

      <NextButtonContainer>
        <Button variant={ButtonVariant.SECONDARY} onClick={advanceStep}>
          Next
        </Button>
      </NextButtonContainer>
    </Box>
  );
};

export default PricingForm;
