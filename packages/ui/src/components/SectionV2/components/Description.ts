import Text from '@ui/components/Text';
import { styled } from '@ui/styles';

export interface DescriptionProps {
  secondary?: boolean;
}

const Description = styled(Text).attrs<DescriptionProps>(({ secondary, color, ...props }) => ({
  color: secondary ? '#62778c' : color,
  fontSize: 13,
  lineHeight: '18px',
  ...props,
}))<DescriptionProps>``;

export default Description;
