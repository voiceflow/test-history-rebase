import { css, styled } from '@ui/styles';

const IconContainer = styled.div<{ isCheckbox?: boolean }>`
  ${({ isCheckbox }) =>
    isCheckbox
      ? css`
          border-radius: 3px;
          box-shadow: 0 1px 0 0 rgba(17, 49, 96, 0.05);
        `
      : css`
          background-color: #fff;
          border-radius: 50%;
        `}
`;

export default IconContainer;
