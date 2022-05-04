import { css, styled, transition } from '@ui/styles';

const AnchorContainer = styled.div<{ opened?: boolean }>`
  ${transition('color')}
  color: #5d9df5;
  font-size: 15px;
  line-height: 1;
  cursor: pointer;

  &:hover {
    color: #4886da;
  }

  ${({ opened }) =>
    opened &&
    css`
      color: #4886da;
    `}
`;

export default AnchorContainer;
