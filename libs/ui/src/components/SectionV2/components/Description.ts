import type { TextProps } from '@/components/Text';
import Text from '@/components/Text';
import { styled } from '@/styles';

export interface DescriptionProps extends TextProps {
  block?: boolean;
  error?: boolean;
  secondary?: boolean;
}

const Description = styled(Text).attrs<DescriptionProps>(({ block, secondary, error, color, ...props }) => ({
  // eslint-disable-next-line no-nested-ternary
  color: error ? '#BD425F' : secondary ? '#62778c' : color,
  display: block ? 'block' : undefined,
  fontSize: 13,
  lineHeight: '18px',
  ...props,
}))<DescriptionProps>``;

export default Description;
