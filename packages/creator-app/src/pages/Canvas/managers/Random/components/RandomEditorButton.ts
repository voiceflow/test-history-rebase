import { Button } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

const RandomEditorButton = styled(Button)<{ hasRight?: boolean }>`
  ${({ hasRight }) =>
    hasRight &&
    css`
      margin-right: 0.5rem;
    `}
`;

export default RandomEditorButton;
