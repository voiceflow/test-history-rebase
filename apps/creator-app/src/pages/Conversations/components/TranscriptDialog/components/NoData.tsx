import { FlexCenter } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs/styled';

const Container = styled(FlexCenter)`
  height: 100%;
`;

const NoData: React.FC = () => <Container>No Data to show</Container>;

export default NoData;
