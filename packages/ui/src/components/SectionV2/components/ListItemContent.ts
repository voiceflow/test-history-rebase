import { SvgIconContainer } from '@ui/components/SvgIcon';
import { css, styled, transition, units } from '@ui/styles';

export interface ListItemContentProps {
  isActive?: boolean;
}

const activeStyle = css`
  border-radius: 6px;
  background: ${({ theme }) => theme.backgrounds.greyGreen};

  ${SvgIconContainer} {
    opacity: 1;
  }
`;

const ListItemContent = styled.div<ListItemContentProps>`
  ${transition('background')}

  display: flex;
  flex: 1;
  align-items: center;
  min-height: ${units(5.25)}px;
  padding: 0 ${units()}px 0 ${units(2)}px;

  ${({ onClick }) =>
    !!onClick &&
    css`
      cursor: pointer;
      user-select: none;
      border-radius: 6px;

      &:hover {
        ${activeStyle}
      }
    `}

  ${SvgIconContainer} {
    opacity: 0.8;
  }

  ${({ isActive }) => isActive && activeStyle}
`;

export default ListItemContent;
