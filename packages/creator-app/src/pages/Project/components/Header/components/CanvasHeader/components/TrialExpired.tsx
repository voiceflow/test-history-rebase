import React from 'react';

import { styled } from '@/hocs/styled';

const ExpiredText = styled.div`
  color: #e91e63;
  font-size: 13px;
  font-family: Open Sans;
  font-weight: 600;
  margin-right: 32px;
`;

const TrialExpired: React.FC = () => <ExpiredText>Trial expired</ExpiredText>;

export default TrialExpired;
