import { css, styled } from '@/hocs';
import { ClassName } from '@/styles/constants';

interface LogicDropdownContainerProps {
  active?: boolean;
}

const LogicDropdownContainer = styled.div<LogicDropdownContainerProps>`
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 6px;
  color: #62778c;

  &:hover {
    color: #3d82e2;
    opacity: 1;
    .${ClassName.SVG_ICON} {
      color: #3d82e2;
      opacity: 1;
    }
  }

  ${({ active }) =>
    active &&
    css`
      color: #3d82e2;
      opacity: 1;
    `}
`;

export default LogicDropdownContainer;
