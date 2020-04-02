import { FlexCenter } from '@/components/Flex';
import { styled } from '@/hocs';

import { CONTENT_HEIGHT } from '../constants';

const EmptyContainer = styled(FlexCenter).attrs({ column: true })`
  width: 100%;
  height: ${CONTENT_HEIGHT}px;

  p {
    margin-top: 15px;
    margin-bottom: 0;
  }
`;

export default EmptyContainer;
