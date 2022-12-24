import { css, styled, transition } from '@/hocs/styled';

interface ItemContainerProps {
  isFocused?: boolean;
}

const Container = styled.div<ItemContainerProps>`
  ${transition('background-color', 'border-color')};

  position: relative;
  padding: 20px 32px;
  background-color: #fff;
  border-bottom: solid 1px #eaeff4;
  cursor: pointer;

  ${({ isFocused }) =>
    isFocused
      ? css`
          ${transition('border-color')};
          background: rgba(238, 244, 246, 0.6);
          border-color: #dfe3ed;

          &:before {
            opacity: 1 !important;
          }
        `
      : css`
          :hover {
            background: rgba(238, 244, 246, 0.32);
          }
        `}

  &:before {
    ${transition('opacity')};
    position: absolute;
    height: 1px;
    top: -1px;
    left: 0;
    right: 0;
    background-color: #dfe3ed;
    content: '';
    opacity: 0;
  }
`;

export default Container;
