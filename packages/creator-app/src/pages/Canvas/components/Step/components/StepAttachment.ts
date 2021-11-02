import { IconButton, IconButtonVariant } from '@voiceflow/ui';

import { styled } from '@/hocs';

const Attachment = styled(IconButton).attrs({
  icon: 'clip',
  variant: IconButtonVariant.SQUARE,
  outlined: true,
  iconProps: { width: 15, heigh: 14 },
})`
  padding: 0;
  width: 36px;
  height: 28px;
  margin-left: 16px;
`;

export default Attachment;
