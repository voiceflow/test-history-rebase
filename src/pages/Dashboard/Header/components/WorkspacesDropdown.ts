import SvgIconContainer from '@/components/SvgIcon/components/SvgIconContainer';
import { styled } from '@/hocs';

const WorkspaceDropdownContainer = styled.div`
  padding: 15px;
  padding-right: 12px;
  cursor: pointer;
  font-size: 18px;
  color: #132144;

  div {
    display: inline-block;
  }

  ${SvgIconContainer} {
    display: inline-block;
    margin-left: 12px;
  }
`;

export default WorkspaceDropdownContainer;
