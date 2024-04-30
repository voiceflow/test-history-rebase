import Popper from '@/components/Popper';
import { styled } from '@/styles';
import { fadeInDownStyle } from '@/styles/animations';

import Box from '../Box';
import { Text } from '../Text';

export const PopperContent = styled(Box.Flex)`
  ${fadeInDownStyle}
  ${Popper.baseStyles}

  align-items: flex-start;
  flex-direction: column;
  justify-content: flex-start;
  max-width: 255px;
  padding: 20px 24px 17px;

  background-color: #fff;
`;

export const Wrapper = styled(Box.FlexCenter)`
  position: relative;
  width: 255px;
  top: 0px;
  left: 0px;
`;

export const Label = styled(Text)`
  margin-bottom: 10px;
  color: #62778c;
  font-size: 13px;
  font-weight: 600;
`;
