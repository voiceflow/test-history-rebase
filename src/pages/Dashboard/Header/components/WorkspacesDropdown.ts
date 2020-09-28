import SvgIconContainer from '@/components/SvgIcon/components/SvgIconContainer';
import { css, styled } from '@/hocs';

const WorkspaceDropdownContainer = styled.div<{ isLoading: boolean }>`
  padding: 15px;
  padding-right: 12px;
  cursor: pointer;
  font-size: 18px;
  color: #132144;

  ${({ isLoading }) =>
    isLoading &&
    css`
      cursor: not-allowed;
    `}

  div {
    display: inline-block;
  }

  ${SvgIconContainer} {
    display: inline-block;
    margin-left: 12px;
  }
`;

export default WorkspaceDropdownContainer;
