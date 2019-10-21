import React from 'react';

import SvgIcon, { SvgIconContainer } from '@/components/SvgIcon';
import { RESPONSE_COLOR_CODES as COLOR_CODES } from '@/constants';
import { styled } from '@/hocs';

const Container = styled.div`
  padding: 16px 32px;
  border: 1px solid rgba(226, 233, 236, 0.93);
  border-bottom: 0;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  font-weight: 600;
  box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.06);

  & ${SvgIconContainer} {
    display: inline-block;
    position: relative;
    top: 3px;
    margin-right: 8px;
  }
`;

const StatusMessage = styled.span`
  color: ${({ color }) => color || 'black'};
`;

const DetermineStatusMeta = (firstNumberOfStatus) => {
  let statusMessage = '';
  let statusColor = null;
  let statusIcon = '';

  switch (firstNumberOfStatus) {
    case '2':
      statusMessage = 'Request succeeded';
      statusColor = COLOR_CODES.GREEN;
      statusIcon = 'check2';
      break;
    case '3':
      statusMessage = 'Redirected';
      statusColor = COLOR_CODES.YELLOW;
      statusIcon = 'info';
      break;
    case '4':
      statusMessage = 'Request failed';
      statusColor = COLOR_CODES.RED;
      statusIcon = 'error';
      break;
    case '5':
      statusMessage = 'Request failed';
      statusColor = COLOR_CODES.RED;
      statusIcon = 'error';
      break;
    default:
  }

  return {
    color: statusColor,
    message: statusMessage,
    icon: statusIcon,
  };
};

function ResultsMetaHeader({ data }) {
  const firstNumberOfStatus = data.status.toString().split('')[0];

  const statusMeta = DetermineStatusMeta(firstNumberOfStatus);

  return (
    <Container>
      <SvgIcon color={statusMeta.color} icon={statusMeta.icon} />
      <StatusMessage color={statusMeta.color}>{statusMeta.message}</StatusMessage>
    </Container>
  );
}

export default ResultsMetaHeader;
