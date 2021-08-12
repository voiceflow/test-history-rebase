import { css, styled } from '@/hocs';

const Container = styled.div<{ focused?: boolean; rightAlign?: boolean; userSpeak?: boolean; isFirstInSeries?: boolean }>`
  display: flex;
  position: relative;
  align-items: flex-end;
  margin-left: 45px;

  ${({ focused }) =>
    focused &&
    css`
      opacity: 100% !important;
    `}

  ${({ isFirstInSeries }) =>
    !isFirstInSeries &&
    css`
      margin-top: 8px;
    `}

  ${({ userSpeak }) =>
    userSpeak &&
    css`
      margin: 24px 0px 24px 0px;
    `}

  ${({ rightAlign = false }) =>
    rightAlign
      ? css`
          flex-direction: row-reverse;
        `
      : css`
          max-width: 500px;
        `}
`;

export default Container;
