import { css, styled } from '@/hocs';

export type MenuItemProps = {
  selected?: boolean;
};

const MenuItem = styled.div<MenuItemProps>`
  margin: 28px 0;
  border-right: 2px solid transparent;
  transition: all 0.2s ease-out;
  cursor: pointer;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }

  ${({ selected }) =>
    selected &&
    css`
      border-color: #5d9df5;
    `}
`;

export default MenuItem;
