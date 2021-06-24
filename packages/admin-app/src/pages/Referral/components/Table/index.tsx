import { Box, BoxFlex, BoxFlexCenter, ConnectedProps } from '@voiceflow/ui';
import moment from 'moment';
import React from 'react';
import { Table } from 'reactstrap';

import Dropdown from '@/components/Dropdown';
import { Option, PAGE_SIZE } from '@/constants';
import * as Referrals from '@/ducks/referral';
import { connect } from '@/hocs';
import { Referral } from '@/models';

import Pagination from './Pagination';
import Status from './Status';

const ReferralsTable: React.FC<ConnectReferralsTableProps> = ({ referrals, getReferrals }) => {
  const [filteredReferrals, filterReferrals] = React.useState<Referral[]>(referrals);
  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const [filter, setFilter] = React.useState<Option>(Option.ACTIVE);

  const pageCount = Math.ceil(filteredReferrals.length / PAGE_SIZE);

  const onPaginationClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, index: number) => {
    e.preventDefault();

    setCurrentPage(index);
  };

  React.useEffect(() => {
    const filteredCodes = getReferrals(filter);

    filterReferrals(filteredCodes);
  }, [referrals, filter]);

  return (
    <>
      <BoxFlexCenter pt={20} pb={2} backgroundColor="#efefef">
        <Pagination currentPage={currentPage} pageCount={pageCount} handleClick={onPaginationClick} />
        <BoxFlex mb={12} width={180}>
          <Box mr={8} fontWeight={600}>
            Filter by:
          </Box>
          <Dropdown
            options={[
              {
                label: Option.ACTIVE,
                onClick: () => setFilter(Option.ACTIVE),
              },
              {
                label: Option.INACTIVE,
                onClick: () => setFilter(Option.INACTIVE),
              },
            ]}
            value={filter}
            noBorder
          />
        </BoxFlex>
      </BoxFlexCenter>

      <Table>
        <thead>
          <tr>
            <th className="align-middle">Code</th>
            <th className="align-middle">Creator ID</th>
            <th className="align-middle">Coupon</th>
            <th className="align-middle">Products</th>
            <th className="align-middle">Redemption Limit</th>
            <th className="align-middle">Redemptions</th>
            <th className="align-middle">Expired at</th>
            <th className="align-middle">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredReferrals.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE).map(
            React.useCallback(
              ({ referralCode, stripeCoupon, stripeProducts = [], redemptionLimit, redemptions, expiry, status, creatorID }) => (
                <tr key={referralCode}>
                  <th scope="row" className="align-middle">
                    {referralCode}
                  </th>
                  <td className="align-middle">{creatorID}</td>
                  <td className="align-middle">{stripeCoupon}</td>
                  <td className="align-middle">{stripeProducts.length > 0 ? stripeProducts?.join(', ') : 'All'}</td>
                  <td className="align-middle">{redemptionLimit}</td>
                  <td className="align-middle">{redemptions}</td>
                  <td className="align-middle">{expiry ? moment.unix(expiry).format('YYYY-MM-DD HH:mm') : null}</td>
                  <td>
                    <Status status={status} referralCode={referralCode} />
                  </td>
                </tr>
              ),
              [filteredReferrals]
            )
          )}
        </tbody>
      </Table>

      <BoxFlexCenter pt={20} pb={2} backgroundColor="#efefef">
        <Pagination currentPage={currentPage} pageCount={pageCount} handleClick={onPaginationClick} />
        <BoxFlex mb={12} width={180}>
          <Box mr={8} fontWeight={600}>
            Filter by:
          </Box>
          <Dropdown
            options={[
              {
                label: Option.ACTIVE,
                onClick: () => setFilter(Option.ACTIVE),
              },
              {
                label: Option.INACTIVE,
                onClick: () => setFilter(Option.INACTIVE),
              },
            ]}
            value={filter}
            noBorder
          />
        </BoxFlex>
      </BoxFlexCenter>
    </>
  );
};

const mapStateToProps = {
  referrals: Referrals.activeReferralsSelector,
};

const mapDispatchToProps = {
  getReferrals: Referrals.getReferrals,
};

export type ConnectReferralsTableProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ReferralsTable);
