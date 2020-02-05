import { FlexCenter } from '@/componentsV2/Flex';
import { styled } from '@/hocs';

const RemoveButton = styled(FlexCenter)`
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  background: white;
  box-shadow: 0px 2px 4px rgba(17, 49, 96, 0.16), 0px 0px 0px rgba(17, 49, 96, 0.04);
`;

export default RemoveButton;
