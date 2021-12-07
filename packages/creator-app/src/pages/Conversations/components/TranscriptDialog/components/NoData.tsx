import { FlexCenter } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs';

const Container = styled(FlexCenter)`
  height: 100%;
`;

const NoData = () => {
  return <Container>No Data to show</Container>;
};

export default NoData;
