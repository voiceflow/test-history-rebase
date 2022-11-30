import SvgIcon from '@ui/components/SvgIcon';
import { css, styled, units } from '@ui/styles';

export const SearchInputIcon = styled(SvgIcon)<{ rotate?: boolean }>`
  position: absolute;
  right: 1px;
  padding: ${units(2)}px ${units(2)}px ${units(2)}px ${units()}px;
  cursor: pointer;

  ${({ rotate }) =>
    rotate &&
    css`
      svg {
        transform: rotate(90deg);
      }
    `}
`;
