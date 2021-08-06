import styled, { css } from 'styled-components';

export interface PageContentProps {
  scrollHorizontal?: boolean;
  canScroll?: boolean;
}

const PageContent = styled.main<PageContentProps>`
  position: relative;
  flex-grow: 1;
  background: ${({ theme }) => theme.backgrounds.offWhite};

  ${({ scrollHorizontal }) =>
    scrollHorizontal &&
    css`
      overflow-x: scroll;
    `}

  ${({ canScroll = true }) =>
    canScroll
      ? css`
          overflow: auto;
        `
      : css`
          overflow: hidden;
        `}
`;

export default PageContent;
