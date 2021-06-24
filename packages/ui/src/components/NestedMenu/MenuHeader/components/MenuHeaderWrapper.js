import { css, styled } from '../../../../styles';

const MenuHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  padding: 0 24px;

  ${({ isFocused }) =>
    isFocused &&
    css`
      background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%), #fff;

      > input {
        background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%), #fff;
      }
    `};
`;

export default MenuHeaderWrapper;
