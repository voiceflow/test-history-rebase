import SvgIcon from '@/components/SvgIcon';
import { css, styled, transition, units } from '@/styles';

export interface ListItemContentProps {
  isActive?: boolean;
  overflowHidden?: boolean;
}

const activeStyle = css`
  border-radius: 6px;
  background: ${({ theme }) => theme.backgrounds.greyGreen};

  ${SvgIcon.Container} {
    opacity: 1;
  }
`;

const ListItemContent = styled.div<ListItemContentProps>`
  ${transition('background')}

  display: flex;
  flex: 1;
  align-items: center;
  min-height: ${units(5.25)}px;
  min-width: 0;
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

  ${SvgIcon.Container} {
    opacity: 0.8;
  }

  ${({ isActive }) => isActive && activeStyle}

  ${({ overflowHidden }) =>
    overflowHidden &&
    css`
      overflow: hidden;
    `}
`;

export default ListItemContent;
