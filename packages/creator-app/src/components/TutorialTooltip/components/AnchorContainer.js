import { css, styled, transition } from '@/hocs';

const AnchorContainer = styled.div`
  cursor: pointer;
  color: #5d9df5;
  font-size: 15px;
  ${transition('color')}

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
