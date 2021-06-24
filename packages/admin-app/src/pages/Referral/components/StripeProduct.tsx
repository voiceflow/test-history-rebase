import { Box, BoxFlex, Select, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';

import * as Referrals from '@/ducks/referral';
import { styled } from '@/styles';

import { ReferralContext } from '../context';

const Container = styled(Box)`
  span {
    box-sizing: initial;
  }
`;

const StripeProduct: React.FC = () => {
  const { state, actions } = useContext(ReferralContext)!;
  const products = useSelector(Referrals.stripeProductsSelector);

  const options = products.map((product) => ({ value: product.id, label: product.name || product.id }));

  const onChange = (product = '') => actions.update({ product });
  const onBlur = ({ currentTarget: { value } }: React.FocusEvent<HTMLInputElement>) => {
    const allProducts = options.map((option) => option.label);

    // save only if valid coupon else empty
    if (allProducts.includes(value)) {
      onChange(options.find((option) => option.label === value)?.value);
    }
  };

  const getValueLabel = React.useCallback((value) => options.find((option) => option.value === value)?.label, [state]);

  return (
    <BoxFlex cursor={state.coupon ? 'not-allowed' : 'default '}>
      <Box ml={20}>
        {products.length ? (
          <Container maxWidth={300}>
            <Select
              searchable
              onBlur={onBlur}
              options={options}
              onSelect={onChange}
              placeholder="Filter by Product "
              value={getValueLabel(state.product)}
              clearable={!!getValueLabel(state.product)}
              createInputPlaceholder="Search a Product"
              getOptionValue={(option) => option?.value || ''}
              renderOptionLabel={(option: { value: string; label: string }) => option.label}
              disabled={!!state.coupon}
            />
          </Container>
        ) : (
          <Box
            p="12px 16px"
            color="#62778c"
            backgroundColor="#fff"
            border="1px solid #d2dae2"
            borderRadius={5}
            fontWeight={600}
            style={{
              boxShadow: '0 0 3px 0 rgba(17, 49, 96, 0.06)',
            }}
          >
            No Products available
          </Box>
        )}
      </Box>
      {state.coupon && (
        <TippyTooltip title="Clear coupon to enable filter">
          <Box ml={10}>
            <SvgIcon icon="info" size={16} color="#6E849A" />
          </Box>
        </TippyTooltip>
      )}
    </BoxFlex>
  );
};

export default StripeProduct;
