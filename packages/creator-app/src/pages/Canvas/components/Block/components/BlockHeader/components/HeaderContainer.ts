import { styled } from '@/hocs';

import { HEADER_HEIGHT } from '../../../constants';

const HeaderContainer = styled.div`
  display: flex;
  min-height: ${HEADER_HEIGHT}px;
`;

export default HeaderContainer;
