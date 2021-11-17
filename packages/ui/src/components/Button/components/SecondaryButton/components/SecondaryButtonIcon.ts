import { css, styled } from '@ui/styles';

interface SecondaryButtonIconProps {
  withoutChildren?: boolean;
}

const SecondaryButtonIcon = styled.span<SecondaryButtonIconProps>`
  width: 16px;
  height: 16px;
  color: rgba(110, 132, 154, 0.85);

  ${({ withoutChildren }) =>
    !withoutChildren &&
    css`
      margin-right: 16px;
    `}
`;

export default SecondaryButtonIcon;
