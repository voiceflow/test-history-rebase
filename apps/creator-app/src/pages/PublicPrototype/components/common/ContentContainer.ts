import { css, styled } from '@/hocs/styled';

interface ContentContainerProps {
  centerAlign?: boolean;
  isMobile?: boolean;
}

const ContentContainer = styled.div<ContentContainerProps>`
  flex: 3;
  display: flex;
  flex-direction: column;

  ${({ centerAlign }) =>
    centerAlign &&
    css`
      text-align: center;
      align-items: center;
      justify-content: center;
    `}

  ${({ isMobile }) =>
    isMobile &&
    css`
      position: relative;
      justify-content: center;
    `}
`;

export default ContentContainer;
