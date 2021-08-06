import { css, styled } from '@/hocs';

interface ItemContainerProps {
  isFocused?: boolean;
}

const Container = styled.div<ItemContainerProps>`
  padding: 20px 32px;
  background-color: #fff;
  border-bottom: solid 1px #eaeff4;

  ${({ isFocused }) =>
    isFocused &&
    css`
      background: rgba(238, 244, 246, 0.85);
    `}

  :hover {
    background: rgba(238, 244, 246, 0.85);
  }
`;

export default Container;
