import { css, styled, transition } from '@/hocs';
import { ClassName } from '@/styles/constants';

const ActionsContainer = styled.div<{ onlyActions?: boolean }>`
  display: flex;
  padding: 0 8px 0 16px;
  margin-top: 18px;

  ${({ onlyActions }) =>
    onlyActions &&
    css`
      ${transition('padding')}

      padding: 0;

      .${ClassName.CANVAS_BLOCK}:hover & {
        padding: 0 8px 0 16px;
      }
    `}
`;

export default ActionsContainer;
