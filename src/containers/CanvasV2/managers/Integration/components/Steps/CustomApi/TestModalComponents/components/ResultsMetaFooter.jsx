import React from 'react';

import { RESPONSE_COLOR_CODES as COLOR_CODES } from '@/constants';
import { styled } from '@/hocs';

const Container = styled.div`
  padding: 16px 32px;
  font-weight: 600;
  border: 1px solid rgba(226, 233, 236, 0.93);
  border-top: 0;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  line-height: 12px;
  box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.06);
`;

const MetaItem = styled.span`
  font-size: 12px;
  margin-right: 16px;
  font-weight: 600;
  color: #62778c;
`;

const MetaValue = styled.span`
  color: ${({ color }) => color || '#132144'};
`;

const DetermineColorCodes = (status, size, time) => {
  let statusColor = null;
  const sizeColor = null;
  let timeColor = null;

  const statusFirstNumber = status?.toString().split('')[0];

  switch (statusFirstNumber) {
    case '2':
      statusColor = COLOR_CODES.GREEN;
      break;
    case '3':
      statusColor = COLOR_CODES.YELLOW;
      break;
    case '4':
      statusColor = COLOR_CODES.RED;
      break;
    case '5':
      statusColor = COLOR_CODES.RED;
      break;
    default:
  }

  switch (true) {
    case time < 300:
      timeColor = COLOR_CODES.GREEN;
      break;
    case time < 600:
      timeColor = COLOR_CODES.YELLOW;
      break;
    default:
      timeColor = COLOR_CODES.RED;
  }

  return {
    status: statusColor,
    size: sizeColor,
    time: timeColor,
  };
};

function ResultsMetaFooter({ data }) {
  const ColorCodes = DetermineColorCodes(data.status, data.size, data.time);

  return (
    <Container>
      <MetaItem>
        Status:
        <MetaValue color={ColorCodes.status}> {data.status}</MetaValue>
      </MetaItem>
      <MetaItem>
        Size:
        <MetaValue color={ColorCodes.size}> {data.size}</MetaValue>
      </MetaItem>
      <MetaItem>
        Time:
        <MetaValue color={ColorCodes.time}> {data.time}ms</MetaValue>
      </MetaItem>
    </Container>
  );
}

export default ResultsMetaFooter;
