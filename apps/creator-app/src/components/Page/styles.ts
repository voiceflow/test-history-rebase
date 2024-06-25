import { css, styled } from '@/hocs/styled';

import type * as T from './types';

export const Container = styled.section`
  flex-direction: column;
  position: relative;
  overflow: hidden;
  overflow: clip;
  display: flex;
  height: 100%;
  width: 100vw;
`;

export const Body = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-grow: 1;
  flex-direction: row;
  overflow: hidden;
  overflow: clip;
  position: relative;

  @supports (-moz-appearance: none) {
    & {
      overflow-y: hidden;
    }
  }
`;

export const ContentContainer = styled.main<T.ContentProps>`
  position: relative;
  flex-grow: 1;
  background: ${({ theme, white }) => (white ? theme.backgrounds.white : theme.backgrounds.offWhite)};
  ${({ sidebarPadding, theme }) => sidebarPadding && `padding-left: ${theme.components.sidebarIconMenu.width}px;`}

  ${({ scrollable }) =>
    scrollable
      ? css`
          overflow-x: hidden;
          overflow-y: auto;
        `
      : css`
          overflow: hidden;
          overflow: clip;
        `}
`;

export const Content = styled.div`
  padding: 32px;
`;
