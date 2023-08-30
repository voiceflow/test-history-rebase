import { styled } from '@ui/styles';

import Box from '../../../Box';
import { Text } from '../../../Text';

export const ColorsList = styled(Box.Flex)`
  width: 100%;
  justify-content: flex-start;
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

export const WrapperTooltip = styled.div`
  display: flex;
  align-items: flex-start;
`;

export const Tooltip = styled(Text)`
  font-family: 'Open Sans';
  border-radius: 6px;

  font-size: 12px;
  color: white;
  display: flex;
  align-items: center;
`;
