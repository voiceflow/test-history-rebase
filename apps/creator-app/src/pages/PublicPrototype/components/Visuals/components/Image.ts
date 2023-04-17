import { Box } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

interface ImageProps {
  url?: string | null;
}

const Image = styled(Box)<ImageProps>`
  background-image: url(${({ url }) => url});
  background-position: top;
  background-size: contain;
  background-repeat: no-repeat;
`;

export default Image;
