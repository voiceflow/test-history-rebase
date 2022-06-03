import { css, styled } from '@/hocs';

const baseFrameStyles = css`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  box-shadow: inset 0 -1px 0 0 rgba(0, 0, 0, 0.12);
`;

export const Container = styled.div`
  margin-right: 16px;
`;

export const Image = styled.div<{ src: string }>`
  ${baseFrameStyles}
  background: ${({ src }) => `url(${src}) no-repeat center center`};
  background-size: cover;
`;

export const Placeholder = styled.div`
  overflow: hidden;
  position: relative;
  ${baseFrameStyles}
  &:before {
    content: '';
    display: block;
    position: absolute;
    background-color: rgb(93 157 245 / 50%);
    width: 20px;
    height: 20px;
  }
  &:after {
    content: '';
    display: block;
    right: 0;
    bottom: 0;
    position: absolute;
    background-color: rgb(93 157 245 / 50%);
    width: 20px;
    height: 20px;
  }
`;
