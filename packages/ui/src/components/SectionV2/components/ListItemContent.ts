import { SvgIconContainer } from '@ui/components/SvgIcon';
import { css, styled, transition, units } from '@ui/styles';

export interface ListItemContentProps {
  isActive?: boolean;
}

const activeStyle = css`
  background: ${({ theme }) => theme.backgrounds.greyGreen};

  ${SvgIconContainer} {
    opacity: 1;
  }
`;

const ListItemContent = styled.div<ListItemContentProps>`
  ${transition('background')}

  display: flex;
  flex: 1;
  padding: ${units(1.25)}px ${units(2)}px;
  border-radius: 6px;

  ${({ onClick }) =>
    !!onClick &&
    css`
      cursor: pointer;
      user-select: none;
    `}

  ${SvgIconContainer} {
    opacity: 0.8;
  }

  &:hover {
    ${activeStyle}
  }

  ${({ isActive }) => isActive && activeStyle}
`;

export default ListItemContent;
