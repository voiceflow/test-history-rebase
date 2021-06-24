import { FlexCenter } from '@voiceflow/ui';

import { styled } from '@/hocs';

const EmptyContainer = styled(FlexCenter).attrs({ column: true })`
  width: 100%;
  height: 100%;

  p {
    margin-top: 15px;
    margin-bottom: 0;
  }
`;

export default EmptyContainer;
