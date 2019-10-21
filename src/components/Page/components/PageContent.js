import styled, { css } from 'styled-components';

const PageContent = styled.main`
  position: relative;
  flex-grow: 1;
  background: ${({ theme }) => theme.color.background};

  ${({ scrollHorizontal }) =>
    scrollHorizontal &&
    css`
      overflow-x: scroll;
    `}

  ${({ canScroll = true }) =>
    !canScroll &&
    css`
      overflow: hidden;
    `}
`;

export default PageContent;
