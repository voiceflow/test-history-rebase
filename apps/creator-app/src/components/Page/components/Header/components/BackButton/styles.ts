import { SvgIcon } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

export const StyledBackButton = styled.button<{ navSidebarWidth?: boolean }>`
  ${transition('background-color')}

  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0;
  margin-right: 24px;
  color: #132144;
  cursor: pointer;
  border: none;
  border-radius: 0;
  background-color: #fff;
  outline: none !important;
  box-shadow: none;

  ${({ navSidebarWidth, theme }) =>
    navSidebarWidth
      ? css`
          width: ${theme.components.navSidebar.width - 2}px;
          padding-right: 130px;
          border-right: solid 1px ${theme.colors.borders};
        `
      : css`
          width: 120px;
          border-right: solid 1px #eaeff4;
        `};

  ${SvgIcon.Container} {
    opacity: 0.8;
    margin-top: 2px;
    margin-right: 10px;
  }

  &:hover {
    background-color: #fbfbfb;
    ${SvgIcon.Container} {
      opacity: 1;
    }
  }
`;
