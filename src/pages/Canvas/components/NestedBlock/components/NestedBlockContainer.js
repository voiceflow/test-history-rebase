import { FloatingCard } from '@/components/Card';
import { flexStyles } from '@/components/Flex';
import { styled, units } from '@/hocs';

const NestedBlockContainer = styled(FloatingCard)`
  ${flexStyles}

  position: relative;
  align-items: flex-start;
  width: 100%;
  border: 0;
  border-radius: 5px;
  margin: ${units(0.5)}px;
  padding: ${units(1.2)}px 0;
  background: #fff;
  cursor: pointer;
  box-shadow: 0 0 1px 1px rgba(17, 49, 96, 0.08);
`;

export default NestedBlockContainer;
