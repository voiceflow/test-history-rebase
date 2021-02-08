import { flexStyles } from '@/components/Flex';
import { styled, units } from '@/hocs';

const ItemWrapper = styled.div.attrs({ fullWidth: true })`
  ${flexStyles}

  &:not(:last-child) {
    margin-bottom: ${units(1.5)}px;
  }
`;

export default ItemWrapper;
