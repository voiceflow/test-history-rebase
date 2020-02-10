import Button from '@/componentsV2/Button';
import { css, styled } from '@/hocs';

const RandomEditorButton = styled(Button)`
  ${({ hasRight }) =>
    hasRight &&
    css`
      margin-right: 0.5rem;
    `}
`;

export default RandomEditorButton;
