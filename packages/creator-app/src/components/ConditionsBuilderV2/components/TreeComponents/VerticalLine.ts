import { css, styled } from '@/hocs';

interface VerticalLineProps {
  topLine?: boolean;
  bottomLine?: boolean;
  active?: boolean;
}

const VerticalLine = styled.div<VerticalLineProps>`
  border: solid 1px rgba(212, 217, 230, 0.65);
  height: calc(50% - 26.5px);

  ${({ topLine }) =>
    topLine &&
    css`
      border-radius: 0 0 50px 50px;
    `}
  width: 0px;
  margin-right: 13px;

  ${({ bottomLine }) =>
    bottomLine &&
    css`
      border-radius: 50px 50px 0 0;
    `}

  ${({ active }) =>
    active &&
    css`
      border-color: rgba(61, 130, 226, 0.3);
    `}
`;

export default VerticalLine;
