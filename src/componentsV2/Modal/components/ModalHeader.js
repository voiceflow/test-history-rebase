import { SvgIconContainer } from '@/components/SvgIcon';
import { flexApartStyles } from '@/componentsV2/Flex';
import { styled, units } from '@/hocs';

const ModalHeader = styled.header`
  ${flexApartStyles}

  width: 100%;
  padding: ${units(3)}px ${units(4)}px;
  color: rgb(140, 148, 166);
  font-weight: 600;
  text-transform: uppercase;

  ${SvgIconContainer} {
    cursor: pointer;
  }
`;

export default ModalHeader;
