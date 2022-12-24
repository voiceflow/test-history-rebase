import { Box, Popper } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const UpgradeContainer = styled(Box)`
  ${Popper.baseStyles}

  background-color: white;
  background-image: none;
  padding: 24px 24px;
  width: 300px;
  font-size: 15px;
`;

export default UpgradeContainer;
