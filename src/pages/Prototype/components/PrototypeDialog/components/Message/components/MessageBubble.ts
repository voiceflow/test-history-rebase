import { css, styled } from '@/hocs';

const Container = styled.div<{ clickable?: boolean; isFirstInSeries?: boolean; rightAlign?: boolean }>`
  position: relative;
  max-width: 100%;
  padding: 12px 16px;
  overflow: hidden;
  color: #132144;
  text-align: left;
  word-break: break-word;
  font-size: 14px;
  border-radius: 15px;
  min-height: 45px;

  ::first-letter {
    text-transform: capitalize;
  }
  ${({ clickable }) =>
    clickable &&
    css`
      cursor: pointer;
    `}

  ${({ rightAlign = false }) =>
    rightAlign
      ? css`
          background-color: #5d9df5;
          color: white;
          border-bottom-right-radius: 5px;
        `
      : css`
          background-color: #f4f4f4;
        `}

${({ rightAlign = false, isFirstInSeries = false }) =>
    !rightAlign &&
    (isFirstInSeries
      ? css`
          border-bottom-left-radius: 5px;
        `
      : css`
          border-top-left-radius: 5px;
        `)}
`;

export default Container;
