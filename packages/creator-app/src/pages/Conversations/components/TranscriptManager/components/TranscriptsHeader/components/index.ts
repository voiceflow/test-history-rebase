import { FlexApart } from '@/components/Flex';
import { styled } from '@/hocs';

export const Container = styled(FlexApart)`
  height: 73px;
  padding: 26px 32px;
  width: 100%;
  background: white;
  border-bottom: 1px solid;
  border-color: ${({ theme }) => theme.colors.borders};
`;
