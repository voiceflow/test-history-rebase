import { FlexCenter } from '@/components/Flex';
import { styled, transition } from '@/hocs';

export { default as SlotTag } from './SlotTag';

export const ColorSelector = styled(FlexCenter)`
  ${transition('transform')}
  height: 26px;
  width: 26px;
  background-color: ${({ color }) => color};
  color: #fff;
  cursor: pointer;
  position: relative;
  margin-right: 6px;
  border-radius: 50%;
  box-shadow: 0 0 1px 0 rgba(19, 33, 68, 0.08), 0 1px 2px 0 rgba(19, 33, 68, 0.2);
  border: 2px solid #fff;
  transition: ease all 0.15s;
  margin-bottom: 16px;

  &:active {
    transform: scale(0.95);
  }
`;
