import { css, styled } from '@/hocs/styled';

import RadioButtonContainer from './RadioButtonContainer';

const RadioGroupContainer = styled.div<{ column?: boolean; noPaddingLastItem?: boolean; fullWidth?: boolean }>`
  display: flex;
  flex-direction: ${({ column }) => (column ? 'column' : 'row')};
  flex-wrap: wrap;

  ${({ noPaddingLastItem = true }) =>
    noPaddingLastItem &&
    css`
      & > ${RadioButtonContainer}:last-child {
        padding-bottom: 0;
      }
    `};

  ${({ fullWidth = false }) =>
    fullWidth &&
    css`
      width: 100%;
    `};
`;

export default RadioGroupContainer;
