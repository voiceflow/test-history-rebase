import { BoxFlex } from '@voiceflow/ui';

import { styled } from '@/hocs';

const Container = styled(BoxFlex).attrs({ as: 'header' })`
  width: 100%;
  height: ${({ theme }) => theme.components.projectPage.header.height}px;
  min-height: ${({ theme }) => theme.components.projectPage.header.height}px;
  position: relative;
  background-color: #fff;
  border-bottom: solid 1px ${({ theme }) => theme.colors.borders};
`;

export default Container;
