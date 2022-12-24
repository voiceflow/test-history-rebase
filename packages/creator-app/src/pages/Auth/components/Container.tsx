import { FlexCenter } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const Container = styled(FlexCenter).attrs({
  fullWidth: true,
  column: true,
})`
  height: 100%;
`;

export default Container;
