import { FloatingCard } from '@/componentsV2/Card';
import { flexCenterStyles } from '@/componentsV2/Flex';
import { styled, transition, units } from '@/hocs';

const BlockContainer = styled(FloatingCard)`
  ${flexCenterStyles}

  position: absolute;
  box-sizing: content-box;
  min-width: 250px;
  max-width: 400px;
  padding: ${units(1.5)}px;
  transform: translateX(-50%);
  background: linear-gradient(180deg, rgba(231, 234, 241, 0.6), rgba(231, 234, 241, 0.86));
  box-shadow: rgba(98, 119, 140, 0.19) 0px 0px 0.1pt 1pt;
  cursor: pointer;
  user-select: none;
  ${transition()}

  &:focus,
  &:focus-within {
    box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
  }
`;

export default BlockContainer;
