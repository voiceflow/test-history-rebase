import { BoxFlex } from '@voiceflow/ui';

import { styled } from '@/hocs';

const Title = styled(BoxFlex)<{ leftOffset?: boolean }>`
  height: 100%;
  font-weight: 600;
  color: #132144;
  padding-left: ${({ leftOffset }) => (leftOffset ? 32 : 0)}px;
`;

export default Title;
