import { SvgIconContainer } from '@/components/SvgIcon';
import Flex from '@/componentsV2/Flex';
import { styled } from '@/hocs';

const DropdownArrowContainer = styled(Flex)`
  margin-right: 4px;

  ${SvgIconContainer} {
    transition: transform 0.15s ease;
    transform: ${(props) => (props.isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)')};
  }
`;

export default DropdownArrowContainer;
