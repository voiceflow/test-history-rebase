import { AlexaConstants, AlexaProject } from '@voiceflow/alexa-types';
import { Box, Button, ButtonVariant, Dropdown, Input, Label, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

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
  { value: AlexaConstants.ProductType.ENTITLEMENT, label: 'One-Time Purchase' },
  { value: AlexaConstants.ProductType.CONSUMABLE, label: 'Consumable' },
  { value: AlexaConstants.ProductType.SUBSCRIPTION, label: 'Subscription' },
];

export const SUBSCRIPTION_OPTIONS = [
  { value: AlexaProject.SubscriptionPaymentFrequency.MONTHLY, label: 'Monthly' },
  { value: AlexaProject.SubscriptionPaymentFrequency.YEARLY, label: 'Yearly' },
];

export interface PricingFormProps {
  advanceStep: VoidFunction;
}

const PricingForm: React.FC<PricingFormProps> = ({ advanceStep }) => {
  const parentalControl = useSelector(VersionV2.active.alexa.parentalControlSelector);
  const { product, patchProduct, setProductProperty } = React.useContext(ProductContext)!;

  const onTypeChange = (value: AlexaConstants.ProductType) => () => {
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
                <TippyTooltip
                  disabled={!(value === AlexaConstants.ProductType.CONSUMABLE && parentalControl)}
                  position="top"
                  content={
                    value === AlexaConstants.ProductType.CONSUMABLE && parentalControl
                      ? 'Consumables are not available for kid skills at this time.'
                      : undefined
                  }
                >
                  <RadioButtonLabel isDisabled={value === AlexaConstants.ProductType.CONSUMABLE && !!parentalControl}>
                    <Input
                      type="radio"
                      name="type"
                      value={value}
                      checked={product.type === value}
                      disabled={value === AlexaConstants.ProductType.CONSUMABLE && parentalControl}
                      onChange={onTypeChange(value)}
                    />
                    <span>{label}</span>
                  </RadioButtonLabel>
                </TippyTooltip>
              </div>
            ))}
          </RadioButtonGroup>
        </SubSection>

        {(product.type === AlexaConstants.ProductType.SUBSCRIPTION || product.type === AlexaConstants.ProductType.CONSUMABLE) && (
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

            {product.type === AlexaConstants.ProductType.SUBSCRIPTION && (
              <SubSection flex>
                <SubscriptionDropdown>
                  <Dropdown<AlexaProject.SubscriptionPaymentFrequency>
                    onSelect={setProductProperty('subscriptionFrequency')}
                    options={SUBSCRIPTION_OPTIONS}
                    autoWidth
                  >
                    {({ ref, onToggle }) => (
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
                <Text>with the trial period of</Text>
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
            {({ ref, onToggle }) => (
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
