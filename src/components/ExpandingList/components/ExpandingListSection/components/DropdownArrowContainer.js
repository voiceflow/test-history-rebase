import Flex from '@/components/Flex';
import * as SvgIcon from '@/components/SvgIcon';
import { styled } from '@/hocs';

const DropdownArrowContainer = styled(Flex)`
  margin-right: 4px;

  ${SvgIcon.Container} {
    transition: transform 0.15s ease;
    transform: ${(props) => (props.isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)')};
  }
`;

export default DropdownArrowContainer;
