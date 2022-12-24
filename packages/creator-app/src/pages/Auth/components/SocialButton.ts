import { Button } from '@voiceflow/ui';
import cn from 'classnames';

import { styled } from '@/hocs/styled';

const SocialButton = styled(Button).attrs<{ light?: boolean }>(({ light }) => ({
  variant: Button.Variant.SECONDARY,
  className: cn('social-button', { 'social-button-light': light }),
}))`
  padding: 10px 20px !important;
`;

export default SocialButton;
