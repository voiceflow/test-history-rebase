import { flexStyles } from '@/components/Flex';
import SvgIcon from '@/components/SvgIcon';
import { styled, transition, units } from '@/hocs';

export const RemoveIcon = styled(SvgIcon).attrs({ icon: 'remove' })`
  margin-left: ${units(2)}px;
  color: #6e849a;
  cursor: pointer;
  ${transition('color')}

  &:hover {
    color: #627990;
  }
`;

export const ItemWrapper = styled.div.attrs({ fullWidth: true })`
  ${flexStyles}

  &:not(:last-child) {
    margin-bottom: ${units(1.5)}px;
  }
`;
