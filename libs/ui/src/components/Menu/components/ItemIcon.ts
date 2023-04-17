import SvgIcon from '@ui/components/SvgIcon';
import { styled } from '@ui/styles';

// needs this to apply custom styles
const ItemIcon = styled(SvgIcon).attrs({ variant: SvgIcon.Variant.STANDARD })`
  margin-right: 16px;
`;

export default ItemIcon;
