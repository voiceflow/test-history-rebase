import { css, styled } from '@/hocs';

export interface ContentProps {
  scrollable: boolean;
}

const PageContent = styled.main<ContentProps>`
  position: relative;
  flex-grow: 1;
  background: ${({ theme }) => theme.backgrounds.offWhite};

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

export default PageContent;
