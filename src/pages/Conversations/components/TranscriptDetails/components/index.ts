import Flex from '@/components/Flex';
import { styled } from '@/hocs';

export { default as Actions } from './Sections/Actions';
export { default as Context } from './Sections/Context';
export { default as Notes } from './Sections/Notes';
export { default as Tags } from './Sections/Tags';

export const Container = styled(Flex)`
  flex: 2;
  border-left: 1px solid;
  border-color: ${({ theme }) => theme.colors.borders};
  height: 100%;
  background: white;
  flex-direction: column;
`;
