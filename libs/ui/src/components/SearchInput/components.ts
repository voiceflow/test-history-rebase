import SvgIcon from '@ui/components/SvgIcon';
import { css, styled, transition, units } from '@ui/styles';

export const SearchInputIcon = styled(SvgIcon)<{ rotateEnabled?: boolean; $secondaryDisabled?: boolean }>`
  ${transition('opacity')}
  position: absolute;
  right: 1px;
  padding: ${units(2)}px ${units(2)}px ${units(2)}px ${units()}px;
  cursor: pointer;

  ${({ rotateEnabled }) =>
    rotateEnabled &&
    css`
      svg {
        transform: rotate(90deg);
      }
    `}

  ${({ $secondaryDisabled }) =>
    $secondaryDisabled &&
    css`
      opacity: 0.85;
      pointer-events: none;
    `}
`;
