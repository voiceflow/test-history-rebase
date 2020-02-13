import { FlexApart } from '@/components/Flex';
import * as SvgIcon from '@/components/SvgIcon';
import { styled } from '@/hocs';

const ExpandingListSectionHeader = styled(FlexApart)`
  cursor: pointer;
  color: #62778c;
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 6px;

  & ${SvgIcon.Container} {
    margin-right: ${({ theme }) => theme.unit * 0.1}px;
    color: #8da2b5;
  }
`;

export default ExpandingListSectionHeader;
