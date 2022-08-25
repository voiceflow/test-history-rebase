import { FadeDown } from '@ui/styles/animations';
import styled from 'styled-components';

import { BoxFlex } from '../Box';
import { Text } from '../Text';

export const PopperContent = styled(BoxFlex)`
  ${FadeDown}

  border-radius: 8px;
  flex-direction: column;
  background-color: #fff;
  box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.06), 0 8px 16px 0 rgba(17, 49, 96, 0.16);
  max-width: 255px;
  padding: 20px 24px 17px;
  box-sizing: border-box;
  font-family: 'Open Sans', sans-serif;

  align-items: flex-start;
  justify-content: flex-start;
`;

export const Wrapper = styled(BoxFlex)`
  position: relative;
  align-items: center;
  justify-content: center;
  width: 255px;
  top: 0px;
  left: 0px;
`;

export const Label = styled(Text)`
  font-family: 'Open Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #62778c;
  margin-bottom: 10px;
`;
