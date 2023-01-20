import { Box } from '@voiceflow/ui';

import { styled, transition } from '@/hocs/styled';

export const LoadMoreButton = styled(Box.FlexCenter)`
  ${transition('background-color', 'box-shadow')}

  height: 60px;
  background-color: #fbfbfb;
  border-top: 1px solid #eaeff4;
  border-radius: 0 0 8px 8px;
  cursor: pointer;
  color: #3d82e2;
  font-size: 15px;
  font-weight: 600;

  &:hover {
    background-color: #eff5f6;
    box-shadow: 0 0 0 1px rgba(204, 211, 228, 0.8);
  }
`;
