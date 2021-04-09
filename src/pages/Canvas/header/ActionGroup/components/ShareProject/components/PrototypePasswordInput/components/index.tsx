import { BlockText } from '@/components/Text';
import { styled } from '@/hocs';

export const StyledBlockText = styled(BlockText)`
  font-size: 13px;
  color: ${(props) => props.theme.colors.secondary};
  padding-top: 16px;
`;

export default StyledBlockText;
