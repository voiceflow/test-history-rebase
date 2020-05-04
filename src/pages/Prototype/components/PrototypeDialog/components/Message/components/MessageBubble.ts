import { css, styled } from '@/hocs';

const Container = styled.div<{ clickable?: boolean }>`
  position: relative;
  max-width: 100%;
  padding: 0.5rem;
  overflow: hidden;
  color: #132144;
  text-align: left;
  word-break: break-word;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 15px;

  ${({ clickable }) =>
    clickable &&
    css`
      cursor: pointer;
    `}
`;

export default Container;
