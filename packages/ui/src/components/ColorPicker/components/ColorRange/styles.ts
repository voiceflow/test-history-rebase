import styled from 'styled-components';

import { BoxFlex } from '../../../Box';

export const RangeContainer = styled(BoxFlex)`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const Button = styled.button`
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const Img = styled.img`
  width: 16px;
  height: 16px;
`;
