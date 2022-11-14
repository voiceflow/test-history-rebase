import { styled } from '@/hocs';

import { SIDEBAR_WIDTH } from '../constants';

export const DashboardWrapper = styled.main`
  background-color: #fff;
`;

export const BodyWrapper = styled.section`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
`;

export const ContentWrapper = styled.div`
  height: 100%;
  width: calc(100% - ${SIDEBAR_WIDTH}px);
`;
