import { styled } from '@/hocs';

import { CONTENT_HEIGHT } from '../constants';

type RightColumnProps = {
  withTopPadding?: boolean;
};

const RightColumn = styled.div<RightColumnProps>`
  width: 490px;
  height: ${CONTENT_HEIGHT}px;
  overflow-x: hidden;
`;

export default RightColumn;
