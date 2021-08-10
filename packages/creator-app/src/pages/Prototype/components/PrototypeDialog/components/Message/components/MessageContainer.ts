import { css, styled } from '@/hocs';

const Container = styled.div<{ rightAlign?: boolean; userSpeak?: boolean; isFirstInSeries?: boolean }>`
  display: flex;
  position: relative;
  align-items: flex-end;
  margin-left: 45px;

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
