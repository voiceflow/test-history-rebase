import { IconButton, IconButtonVariant } from '@voiceflow/ui';

import { styled } from '@/hocs';

const StyledActionsButton = styled(IconButton).attrs({ icon: 'ellipsis', variant: IconButtonVariant.BASIC })`
  margin: 0;
`;

export default StyledActionsButton;
