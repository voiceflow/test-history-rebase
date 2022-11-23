import { Text } from '@voiceflow/ui';

import { styled } from '@/hocs';

import { HEADER_HEIGHT } from '../../constants';

export const ProjectListWrapper = styled.section`
  width: 100%;
  flex: 1;
  overflow-y: scroll;
  padding: 32px 16px;
  height: calc(100vh - ${HEADER_HEIGHT}px);
`;

export const Item = styled.div`
  width: calc(100% / 3);
  display: inline-flex;
  padding-bottom: 32px;
  padding-left: 16px;
  padding-right: 16px;
`;

export const Title = styled(Text)`
  width: 100%;
  font-size: 18px;
  font-weight: 700;
  display: inline-flex;
  margin-bottom: 16px;
  margin-top: 17px;
  padding-left: 16px;
`;

export const Footer = styled.footer`
  width: 100%;
`;
