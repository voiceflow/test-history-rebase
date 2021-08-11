import { backgrounds, colors, css, styled } from '../../../../styles';

const MenuHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 24px;
  cursor: pointer;

  ${({ isDisabled }) =>
    isDisabled &&
    css`
      pointer-events: none;
      filter: grayscale(100%);
    `};

  ${({ isFocused }) =>
    isFocused &&
    css`
      background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, ${backgrounds('greyGreen')} 100%), ${colors('white')};

      > input {
        background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, ${backgrounds('greyGreen')} 100%), ${colors('white')};
      }
    `};
`;

export default MenuHeaderWrapper;
