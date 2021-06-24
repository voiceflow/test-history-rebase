import { FlexCenter } from '@voiceflow/ui';

import { styled } from '@/hocs';

const MenuContainer = styled(FlexCenter)`
  position: relative;
  flex-direction: column;
  justify-content: flex-start;
  width: 65px;
  border-right: 1px solid #dfe3ed;
  background-color: #fff;
  z-index: 10;
`;

export default MenuContainer;
