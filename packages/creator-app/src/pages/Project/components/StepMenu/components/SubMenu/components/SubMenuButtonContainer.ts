import { css, styled, transition } from '@/hocs';

interface SubMenuButtonContainerProps {
  isClicked: boolean;
}

export const SubMenuButtonContainer = styled.div<SubMenuButtonContainerProps>`
  width: 142px;
  height: 38px;
  padding: 9px 16px 8px;
  border-radius: 5px;
  &:hover {
    cursor: grab;
    box-shadow: 0 2px 3px 0 rgba(19, 33, 68, 0.08), 0 0 0 1px rgba(19, 33, 68, 0.06);
    background-color: #fdfdfd;
  }

  ${transition('box-shadow', 'background-color')}

  ${({ isClicked }) =>
    isClicked &&
    css`
      transition: transform 0s;
      transform: rotate(-2deg);
    `}
`;
