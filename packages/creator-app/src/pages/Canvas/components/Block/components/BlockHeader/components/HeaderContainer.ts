import { flexCenterStyles } from '@voiceflow/ui';

import { styled } from '@/hocs';

import { HEADER_HEIGHT } from '../../../constants';

const HeaderContainer = styled.div`
  ${flexCenterStyles}

  height: ${HEADER_HEIGHT}px;
  text-overflow: ellipsis;

  padding: 0 42px;
`;

export default HeaderContainer;
