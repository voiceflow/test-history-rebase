import { css, styled } from '@/hocs';

interface ContentContainerProps {
  withoutHeader?: boolean;
}

const ContentContainer = styled.div<ContentContainerProps>`
  ${({ withoutHeader }) =>
    withoutHeader
      ? css`
          margin: -4px 0;
        `
      : css`
          padding-bottom: 16px;
        `}
`;

export default ContentContainer;
