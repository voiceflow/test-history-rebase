/* eslint-disable no-nested-ternary */
import { css, styled } from '@/hocs/styled';

export const Outer = styled.div<{ isPublic?: boolean }>`
  position: relative;
  display: flex;
  flex: 1;
  height: 100%;
  padding-top: 0;

  ${({ isPublic }) =>
    isPublic &&
    css`
      max-width: 500px;
    `}
`;

export const Middle = styled.div<{ showPadding?: boolean; isMobile?: boolean }>`
  position: absolute;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;

  ${({ isMobile }) =>
    isMobile &&
    css`
      justify-content: flex-end;
    `}
`;

export const Content = styled.div<{ showPadding?: boolean; isMobile?: boolean }>`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;

  padding-top: ${({ showPadding, isMobile }) => (showPadding ? (isMobile ? '20px' : '40px') : 0)};
  padding-left: 24px;
  padding-right: 24px;

  overflow-y: ${({ isMobile }) => (isMobile ? 'scroll' : 'auto')};
  -webkit-overflow-scrolling: touch;
`;
