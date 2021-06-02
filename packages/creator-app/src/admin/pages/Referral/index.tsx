import React from 'react';
import { Col, Form } from 'reactstrap';
import { ThemeContext } from 'styled-components';

import * as Referrals from '@/admin/store/ducks/referral';
import { AdminTitle } from '@/admin/styles';
import Box, { Flex } from '@/components/Box';
import Button from '@/components/Button';
import SvgIcon from '@/components/SvgIcon';
import Tooltip from '@/components/TippyTooltip';
import { connect } from '@/hocs';
import { useSetup } from '@/hooks';
import { ConnectedProps } from '@/types';
import { compose } from '@/utils/functional';

import { Code, Coupon, Creator, Expiry, RedemptionLimit, Status, Table } from './components';
import { DEFAULT_STATE, ReferralContext, withReferralProvider } from './context';

const Referral: React.FC<ConnectedReferralsProps> = ({ setReferral, getReferralData }) => {
  const theme = React.useContext(ThemeContext) as any;
  const { state, actions } = React.useContext(ReferralContext)!;

  useSetup(() => {
    getReferralData();
  });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setReferral(state, () => actions.update(DEFAULT_STATE));
  };

  return (
    <>
      <Box borderBottom="1px solid" borderColor={theme.palette.grey.faint} p={theme.unit * 2}>
        <AdminTitle>Referral</AdminTitle>
      </Box>
      <Box pt={theme.unit * 2} pb={theme.unit * 2}>
        <Form onSubmit={onSubmit}>
          <Code />
          <Coupon />
          <RedemptionLimit />
          <Expiry />
          <Status />
          <Creator />
          <Flex p={theme.unit * 2}>
            <Col sm={2} />
            <Flex>
              {' '}
              <Button type="submit" disabled={!(state.code && (state.coupon || state.creatorID))}>
                Submit
              </Button>
              <Tooltip title="A code can be created once a Coupon or Creator ID is provided">
                <Box ml={8}>
                  <SvgIcon icon="info" size={14} color="#6E849A" />
                </Box>
              </Tooltip>
            </Flex>
          </Flex>
        </Form>
      </Box>
      <Box pt={theme.unit * 2} pb={theme.unit * 2}>
        <Table />
      </Box>
    </>
  );
};

const mapDispatchToProps = {
  setReferral: Referrals.setReferral,
  getReferralData: Referrals.getReferralData,
};

export type ConnectedReferralsProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default compose(connect(null, mapDispatchToProps), withReferralProvider)(Referral);
