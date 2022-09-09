import SvgIcon from '@ui/components/SvgIcon';
import { styled } from '@ui/styles';

// needs this to apply custom styles
const ItemActionIcon = styled(SvgIcon).attrs({ variant: SvgIcon.Variant.STANDARD, clickable: true })`
  margin-left: auto;
  padding-left: 16px;
`;

export default ItemActionIcon;
