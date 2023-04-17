import { styled, transition } from '@/hocs/styled';
import { ClassName } from '@/styles/constants';

const ActionsContainer = styled.div<{ onlyActions?: boolean }>`
  ${transition('padding')}
  display: flex;
  margin-top: 18px;
  padding: 0;

  .${ClassName.CANVAS_BLOCK}:hover & {
    padding: 0 8px 0 16px;
  }
`;

export default ActionsContainer;
