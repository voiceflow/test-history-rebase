import Flex from '@/components/Flex';
import { styled } from '@/hocs';
import THEME from '@/styles/theme';

export const Container = styled(Flex)`
  flex: 5;
  flex-direction: column;
  min-width: 0;
  padding: 0 16px;
`;

export const Name = styled.div`
  font-size: 15px;
  width: 100%;
  margin-bottom: 6px;
`;

export const MetaContainer = styled.div`
  width: 100%;
  color: ${THEME.colors.secondary};
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
