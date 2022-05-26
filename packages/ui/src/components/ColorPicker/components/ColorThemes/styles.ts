import styled from 'styled-components';

import { BoxFlex } from '../../../Box';
import { Text } from '../../../Text';

export const ColorsList = styled(BoxFlex)`
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;

  .vf-tooltip {
    margin-right: 10.5px;
    display: inline-block;

    &:nth-child(5n) {
      margin-right: 0px;
    }
    &:nth-child(n + 6) {
      margin-top: 15px;
    }
  }
`;

export const ColorsContainer = styled.section`
  width: 100%;
  display: inline-block;
`;

export const WrapperTooltip = styled(Text)`
  height: 40px;
  display: flex;
  align-items: flex-start;
`;

export const Tooltip = styled(Text)`
  font-family: 'Open Sans';
  padding: 0px 16px;
  height: 34px;
  border-radius: 6px;
  background-color: #2b2f32;
  font-size: 13px;
  color: white;
  display: flex;
  align-items: center;
`;
