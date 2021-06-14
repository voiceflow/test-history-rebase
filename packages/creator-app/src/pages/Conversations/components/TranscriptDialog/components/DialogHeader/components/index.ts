import { FlexApart } from '@/components/Flex';
import { styled } from '@/hocs';

export const Container = styled(FlexApart)`
  height: 72px;
  padding: 26px 32px;
  width: 100%;
  backdrop-filter: blur(8px);
  box-shadow: 0 1px 3px 0 rgba(19, 33, 68, 0.08);
  background-color: rgba(255, 255, 255, 0.85);
`;
