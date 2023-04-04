import { FlexCenter } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

const UploadImageContainer = styled(FlexCenter)<{ hasBorderRight?: boolean }>`
  padding: 24px;
  flex-direction: column;
  flex: 1;
  align-self: flex-start;

  ${({ hasBorderRight }) =>
    hasBorderRight &&
    css`
      border-right: solid 1px #e3e9ec;
    `}
`;

export default UploadImageContainer;
