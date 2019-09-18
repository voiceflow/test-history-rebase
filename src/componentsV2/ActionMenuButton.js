import { css, styled } from '@/hocs';

const activeButtonStyle = css`
  color: #5d9df5;
  box-shadow: rgba(91, 157, 250, 0.6) 0px 0px 0px 1px;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(255, 255, 255);
  border-image: initial;
  background: linear-gradient(rgba(93, 157, 245, 0.082), rgba(93, 157, 245, 0.19));
`;

const MenuIcon = styled.div`
  position: absolute;
  height: 42px;
  width: 42px;
  top: 10px;
  right: 10px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.25s ease;
  border-radius: 50%;
  border: 1px solid transparent;
  cursor: pointer;

  &:hover {
    color: #62778c;
    box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.04), 0 2px 6px 0 rgba(17, 49, 96, 0.24);
  }

  ${({ active }) =>
    active &&
    css`
      ${activeButtonStyle}

      &:hover {
        ${activeButtonStyle}
      }
    `}
`;

export default MenuIcon;
