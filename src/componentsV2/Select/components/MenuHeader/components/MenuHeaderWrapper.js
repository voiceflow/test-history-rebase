import { css, styled } from '@/hocs';

const MenuHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 24px;
  margin-bottom: 6px;

  ${({ isFocused }) =>
    isFocused &&
    css`
      background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%), #ffffff;

      > input {
        background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%), #ffffff;
      }
    `};
`;

export default MenuHeaderWrapper;
