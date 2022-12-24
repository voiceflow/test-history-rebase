import { transparentize } from 'polished';

import { styled, transition } from '@/hocs/styled';

const AttributeValueText = styled.span`
  color: ${({ color }) => color};
  cursor: pointer;
  ${transition('background-color')}

  &:hover {
    background-color: ${({ color }) => transparentize(0.9, color)};
  }
`;

export default AttributeValueText;
