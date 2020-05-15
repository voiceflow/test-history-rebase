import { css, styled } from '@/hocs';

const SecondaryButtonIcon = styled.span`
  height: 16px;
  width: 16px;
  color: rgba(110, 132, 154, 0.85);

  ${({ withoutChildren }) =>
    !withoutChildren &&
    css`
      margin-right: 16px;
    `}
`;

export default SecondaryButtonIcon;
