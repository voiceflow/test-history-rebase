import styled, { css } from 'styled-components';

const Link = styled.a`
  color: ${({ variant }) => (variant === 'hidden' ? '#132144' : '#5')};
  font-size: ${({ variant }) => (variant === 'secondary' ? 13 : 15)}px;
  line-height: 18px;
  user-select: none;

  ${({ disabled, variant }) =>
    disabled
      ? css`
          color: ${variant === 'hidden' ? '#62778C' : 'rgba(70, 102, 234, 0.5)'};
          pointer-events: none;
        `
      : css`
          cursor: pointer;

          &:hover {
            color: ${variant === 'hidden' ? '#4666EA' : '#5d7af1'};
          }
        `}

  &:active {
    color: #2541b4;
  }
`;

export default Link;
