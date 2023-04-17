import { Box } from '@voiceflow/ui';

import { styled, transition } from '@/hocs/styled';

export const LoadMoreButton = styled(Box.FlexCenter)`
  ${transition('background-color')}

  height: 60px;
  background-color: #fbfbfb;
  border-top: 1px solid #eaeff4;
  border-radius: 0 0 8px 8px;
  cursor: pointer;
  color: #3d82e2;
  font-size: 15px;
  font-weight: 600;

  &:hover {
    background-color: #f9f9f9;
  }
`;
