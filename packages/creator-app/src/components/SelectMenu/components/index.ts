import { Container } from '@/components/Tooltip/components';
import { styled } from '@/hocs';

export { default as MenuSection } from './MenuSection';
export { default as SelectMenuHeader } from './SelectMenuHeader';

export const SelectMenuContainer = styled(Container)`
  width: 300px;
  padding: 0px;
  max-height: none;
  overflow: hidden;
`;
