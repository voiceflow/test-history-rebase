import { Box } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const Container = styled(Box.FlexCenter)`
  background-image: repeating-linear-gradient(
    45deg,
    rgb(141 162 181 / 8%),
    rgb(141 162 181 / 8%) 1.5px,
    rgb(255, 255, 255) 1.5px,
    rgb(255, 255, 255) 6.36px
  );

  height: 100%;
  width: 100%;
`;
