import { css, styled } from '@/hocs';

type ContentContainerProps = {
  centerAlign?: boolean;
};

const ContentContainer = styled.div<ContentContainerProps>`
  flex: 3;
  display: flex;

  ${({ centerAlign }) =>
    centerAlign &&
    css`
      text-align: center;
      align-items: center;
    `}
`;

export default ContentContainer;
