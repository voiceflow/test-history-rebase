import { css, styled } from '@/hocs';

interface ContainerProps {
  isOpen?: boolean;
  canvasOnly?: boolean;
  menuWidth: number;
}

export const FullHeightContainer = styled.aside<ContainerProps>`
  position: absolute;
  top: 0;
  bottom: 0;

  left: ${({ canvasOnly, theme }) => (canvasOnly ? 0 : theme.components.sidebarIconMenu.width)}px;
  transform: translateX(-${({ menuWidth }) => menuWidth}px);
  transition: transform 350ms cubic-bezier(0.075, 0.82, 0.165, 1);
  will-change: transform;

  ${({ isOpen }) =>
    isOpen &&
    css`
      transform: translateX(0) !important;
    `}

  &:focus {
    outline: 0;
  }
`;

export const Content = styled.div`
  display: flex;
  height: 100%;
  background-color: #fdfdfd;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  padding: 12px 16px;
`;

export const Header = styled.header`
  color: #132144;
  font-size: 13px;
  line-height: normal;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
`;
