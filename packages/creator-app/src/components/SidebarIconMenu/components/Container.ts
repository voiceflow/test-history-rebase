import { FlexCenter } from '@voiceflow/ui';

import { styled } from '@/hocs';
import { ClassName } from '@/styles/constants';

const Container = styled(FlexCenter)`
  width: 100%;
  height: 100%;
  padding: 24px 0;
  flex-direction: column;
  justify-content: flex-start;

  .${ClassName.TOOLTIP} {
    display: block;
    width: 100%;
  }
`;

export default Container;
