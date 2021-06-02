import { FlexCenter } from '@/components/Flex';
import { styled } from '@/hocs';

const Container = styled(FlexCenter)`
  height: ${({ theme }) => theme.components.audioPlayer.height}px;
  border: 1px solid #d4d9e6;
  border-radius: 5px;
  padding: 0 40px;
  color: #62778c;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100%;
  background: white;
  text-align: center;
`;
export default Container;
