import React, { useContext } from 'react';
import { useSelector } from 'react-redux';

import * as Referrals from '@/admin/store/ducks/referral';
import Box, { Flex } from '@/components/Box';
import Select from '@/components/Select';
import { connect, styled } from '@/hocs';
import { ConnectedProps } from '@/types';

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

  const [filteredCoupons, setfilteredCoupons] = React.useState(coupons);

  const options = filteredCoupons.map((coupon) => ({ value: coupon.id, label: coupon.name || coupon.id }));

  const onChange = React.useCallback((coupon = '') => actions.update({ coupon }), [actions.update]);
  const onBlur = ({ currentTarget: { value } }: React.FocusEvent<HTMLInputElement>) => {
    const allCoupons = options.map((option) => option.label);

    // save only if valid coupon else empty
    if (allCoupons.includes(value)) {
      onChange(options.find((option) => option.label === value)?.value);
    }
  };

  const getValueLabel = React.useCallback((value) => options.find((option) => option.value === value)?.label, [state]);

  React.useEffect(() => {
    setfilteredCoupons(
      state.product ? coupons.filter((coupon) => coupon.applies_to && coupon.applies_to.products?.includes(state.product)) : coupons
    );
  }, [coupons, state.product]);

  return (
    <FormSection label="Stripe Coupon" labelFor="coupon">
      <Flex>
        {coupons.length ? (
          <Container maxWidth={300}>
            <Select
              searchable
              onBlur={onBlur}
              options={options}
              onSelect={onChange}
              placeholder="Select a coupon"
              value={getValueLabel(state.coupon)}
              clearable={!!getValueLabel(state.coupon)}
              createInputPlaceholder="Search a coupon"
              getOptionValue={(option) => option?.value || ''}
              renderOptionLabel={(option: { value: string; label: string }) => option.label}
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
      </Flex>
    </FormSection>
  );
};

const mapStateToProps = {
  coupons: Referrals.stripeCouponsSelector,
};

export type ConnectReferralsTableProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(Coupon);
