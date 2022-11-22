import { Text } from '@voiceflow/ui';

import { styled } from '@/hocs';
import { HEADER_HEIGHT } from '@/pages/DashboardV2/constants';

export const SectionWrapper = styled.section`
  width: 100%;
  height: calc(100vh - ${HEADER_HEIGHT}px);
  padding: 32px;
`;

export const Title = styled(Text)`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

export const Description = styled(Text)`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondary};
  padding-top: 4px;
`;
