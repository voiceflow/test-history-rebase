import { Box, Button, compose, ConnectedProps, SvgIcon, TippyTooltip, useSetup } from '@voiceflow/ui';
import React from 'react';
import { Col, Form } from 'reactstrap';
import { ThemeContext } from 'styled-components';

import { PageTitle } from '@/components/PageLayout';
import * as Referrals from '@/ducks/referral';
import { connect } from '@/hocs';

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
        <PageTitle>Referral</PageTitle>
      </Box>
      <Box pt={theme.unit * 2} pb={theme.unit * 2}>
        <Form onSubmit={onSubmit}>
          <Code />
          <Coupon />
          <RedemptionLimit />
          <Expiry />
          <Status />
          <Creator />
          <Box.Flex p={theme.unit * 2}>
            <Col sm={2} />
            <Box.Flex>
              {' '}
              <Button type="submit" disabled={!(state.code && (state.coupon || state.creatorID))}>
                Submit
              </Button>
              <TippyTooltip title="A code can be created once a Coupon or Creator ID is provided">
                <Box ml={8}>
                  <SvgIcon icon="info" size={14} color="#6E849A" />
                </Box>
              </TippyTooltip>
            </Box.Flex>
          </Box.Flex>
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
