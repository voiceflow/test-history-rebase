import SvgIcon from '@/components/SvgIcon';
import { styled } from '@/styles';

const ItemNextIcon = styled(SvgIcon).attrs({
  icon: 'arrowRight',
  width: 6,
  height: 10,
  variant: SvgIcon.Variant.STANDARD,
})`
  margin-left: auto;
  padding-left: 16px;
`;

export default ItemNextIcon;
