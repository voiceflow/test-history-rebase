import * as SvgIcon from '@/components/SvgIcon';
import { styled } from '@/hocs';

const GroupBlockSectionLabel = styled.div`
  width: 100%;
  font-weight: 600;
  font-size: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 9px;
  position: relative;
  color: #62778c;
  padding: 0px 20px;
  text-align: center;

  ${SvgIcon.Container} {
    position: absolute;
    left: 8px;
    top: 3px;
    cursor: help;
  }
`;

export default GroupBlockSectionLabel;
