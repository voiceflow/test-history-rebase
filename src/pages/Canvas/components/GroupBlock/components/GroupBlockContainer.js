import { styled, units } from '@/hocs';
import BlockCard from '@/pages/Canvas/components/BlockCard';

const GroupBlockContainer = styled(BlockCard)`
  min-width: 300px;
  border: 2px solid #fff;
  padding: ${units(0.5)}px ${units(2)}px ${units(1.5)}px ${units(2)}px;
  background-image: linear-gradient(180deg, rgba(231, 234, 241, 0.5), rgba(231, 234, 241, 0.9));

  cursor: pointer;
`;

export default GroupBlockContainer;
