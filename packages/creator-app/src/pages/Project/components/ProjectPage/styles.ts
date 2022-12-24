import UIPage from '@/components/Page';
import { css, styled } from '@/hocs/styled';

export const Page = styled(UIPage)<{ isCreatingMarkupText?: boolean }>`
  ${({ isCreatingMarkupText }) =>
    isCreatingMarkupText &&
    css`
      cursor: text;
    `}
`;

export const Content = styled.section`
  position: relative;
`;

export const ClickableLayer = styled.div`
  position: absolute;
  min-width: 60px;
  height: 100%;
  width: 100%;
  z-index: 30;
  top: 0;
`;
