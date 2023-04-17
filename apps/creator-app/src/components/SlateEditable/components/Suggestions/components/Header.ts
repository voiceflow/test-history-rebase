import { styled } from '@/hocs/styled';

interface HeaderProps {
  active?: boolean;
}

const Header = styled.div<HeaderProps>`
  height: 42px;
  align-items: center;
  display: flex;
  padding: 0 24px;

  input {
    user-select: auto;
    background-color: transparent;
  }
`;

export default Header;
