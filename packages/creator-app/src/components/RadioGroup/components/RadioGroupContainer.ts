import { styled } from '@/hocs';

import RadioButtonContainer from './RadioButtonContainer';

const RadioGroupContainer = styled.div<{ column?: boolean; noPaddingLastItem?: boolean }>`
  display: flex;
  flex-direction: ${({ column }) => (column ? 'column' : 'row')};
  flex-wrap: wrap;

  & > ${RadioButtonContainer}:last-child {
    padding-bottom: 0;
  }
`;

export default RadioGroupContainer;
