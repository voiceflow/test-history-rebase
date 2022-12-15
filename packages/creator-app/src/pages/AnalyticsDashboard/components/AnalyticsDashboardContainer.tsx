import { Flex } from '@voiceflow/ui';

import { styled } from '@/hocs';

const AnalyticsDashboardContainer = styled(Flex)`
  height: 100%;
  padding-left: ${({ theme }) => theme.components.sidebarIconMenu.width}px;
`;

export default AnalyticsDashboardContainer;
