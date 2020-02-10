import { FlexCenter } from '@/components/Flex';
import { styled } from '@/hocs';

const Icon = styled(FlexCenter)`
  width: ${({ size, width = size }) => width}px;
  height: ${({ size, height = size }) => height}px;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #fff, 0 1px 2px 1px rgba(17, 49, 96, 0.16);
  background: ${({ background }) => background && `url(${background}) no-repeat center`};
  background-size: contain;
`;

export default Icon;
