import { Utils } from '@voiceflow/common';
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

  const options = React.useMemo(() => products.map((product) => ({ value: product.id, label: product.name || product.id })), [products]);
  const optionsMap = React.useMemo(() => Utils.array.createMap(options, Utils.object.selectValue), [options]);

  const onBlur = ({ currentTarget: { value } }: React.FocusEvent<HTMLInputElement>) => {
    const option = options.find((option) => option.label.toLowerCase() === value.toLowerCase());

    // save only if valid coupon else empty
    if (option) {
      actions.update({ product: option.value });
    }
  };

  return (
    <BoxFlex cursor={state.coupon ? 'not-allowed' : 'default '}>
      <Box ml={20}>
        {products.length ? (
          <Container maxWidth={300}>
            <Select
              value={state.product}
              onBlur={onBlur}
              options={options}
              onSelect={(value) => actions.update({ product: value ?? '' })}
              disabled={!!state.coupon}
              clearable={!!state.product}
              searchable
              placeholder="Filter by Product "
              getOptionKey={(option) => option.value}
              getOptionValue={(option) => option?.value || ''}
              getOptionLabel={(value) => value && optionsMap[value]?.label}
              renderOptionLabel={(option: { value: string; label: string }) => option.label}
              createInputPlaceholder="Search a Product"
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
