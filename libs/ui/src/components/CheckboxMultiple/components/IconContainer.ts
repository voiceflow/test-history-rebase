import { css, styled } from '@ui/styles';

const IconContainer = styled.div<{ checked?: boolean }>`
  border-radius: 3px;

  ${({ checked }) =>
    checked
      ? css`
          box-shadow: inset 0 0 0 1px #3d82e2, 1px -1px 0 0 #fff, 2px -2px 0 0 rgb(60 130 226 / 65%);
        `
      : css`
          box-shadow: inset 0 0 0 1px #8da2b6, 1px -1px 0 0 #fff, 2px -2px 0 0 rgb(141 162 181 / 65%);
        `}
`;

export default IconContainer;
