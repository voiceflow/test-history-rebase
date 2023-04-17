import { Box, FlexCenter } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

export const prefixTextStyles = css`
  font-size: 13px;
  color: #62778c;
  font-weight: 600;
`;

export const PrefixText = styled(Box)`
  ${prefixTextStyles};
`;

const Prefix = styled(FlexCenter)`
  ${prefixTextStyles};
  position: absolute;
  left: 16px;

  z-index: 1;
`;

export default Prefix;
