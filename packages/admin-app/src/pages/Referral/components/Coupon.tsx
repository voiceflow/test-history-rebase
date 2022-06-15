import { Utils } from '@voiceflow/common';
import { Box, ConnectedProps, Select } from '@voiceflow/ui';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';

import * as Referrals from '@/ducks/referral';
import { connect } from '@/hocs';
import { styled } from '@/styles';

import { ReferralContext } from '../context';
import FormSection from './FormSection';
import StripeProduct from './StripeProduct';

const Container = styled(Box)`
  span {
    box-sizing: initial;
  }
`;

const Coupon: React.FC = () => {
  const { state, actions } = useContext(ReferralContext)!;
  const coupons = useSelector(Referrals.stripeCouponsSelector);

  const [filteredCoupons, setFilteredCoupons] = React.useState(coupons);

  const options = React.useMemo(() => filteredCoupons.map((coupon) => ({ value: coupon.id, label: coupon.name || coupon.id })), [filteredCoupons]);
  const optionsMap = React.useMemo(() => Utils.array.createMap(options, Utils.object.selectValue), [options]);

  const onBlur = ({ currentTarget: { value } }: React.FocusEvent<HTMLInputElement>) => {
    const option = options.find((option) => option.label.toLowerCase() === value.toLowerCase());

    // save only if valid coupon else empty
    if (option) {
      actions.update({ coupon: option.value });
    }
  };

  React.useEffect(() => {
    const netFilteredCoupons = state.product
      ? coupons.filter((coupon) => coupon.applies_to && coupon.applies_to.products?.includes(state.product))
      : coupons;

    setFilteredCoupons(netFilteredCoupons);
  }, [coupons, state.product]);

  return (
    <FormSection label="Stripe Coupon" labelFor="coupon">
      <Box.Flex>
        {coupons.length ? (
          <Container maxWidth={300}>
            <Select
              value={state.coupon}
              onBlur={onBlur}
              options={options}
              onSelect={(value) => actions.update({ coupon: value ?? '' })}
              clearable={!!state.coupon}
              searchable
              placeholder="Select a coupon"
              getOptionKey={(option) => option.value}
              getOptionValue={(option) => option?.value || ''}
              getOptionLabel={(value) => value && optionsMap[value]?.label}
              renderOptionLabel={(option: { value: string; label: string }) => option.label}
              createInputPlaceholder="Search a coupon"
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
            No coupons available
          </Box>
        )}
        <StripeProduct />
      </Box.Flex>
    </FormSection>
  );
};

const mapStateToProps = {
  coupons: Referrals.stripeCouponsSelector,
};

export type ConnectReferralsTableProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(Coupon);
