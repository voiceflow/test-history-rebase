import { css, styled, transition } from '@ui/styles';

export interface SecondaryButtonIconProps {
  withoutChildren?: boolean;
}

const SecondaryButtonIcon = styled.span<SecondaryButtonIconProps>`
  ${transition('color')}
  width: 16px;
  height: 16px;

  color: ${({ theme }) => theme.buttonIconColors.default};

  ${({ withoutChildren }) =>
    !withoutChildren &&
    css`
      margin-right: 16px;
    `}
`;

export default SecondaryButtonIcon;
