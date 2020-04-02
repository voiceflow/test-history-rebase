import { dragPlaceholderStyles } from '@/components/DragPlaceholder';
import { css, styled, transition, units } from '@/hocs';
import { MERGE_ACTIVE_NODE_CLASSNAME } from '@/pages/Canvas/constants';

import { stepBoxShadowStyles } from '../styles';

export type StepReorderIndicatorContainerProps = {
  isActive: boolean;
};

const StepReorderIndicatorContainer = styled.span<StepReorderIndicatorContainerProps>`
  position: relative;
  display: block;
  height: 0;
  width: 100%;
  border-radius: 5px;
  ${transition('height', 'margin')}
  ${dragPlaceholderStyles};

  &&& {
    margin: 0;
  }

  ${({ isActive }) =>
    isActive &&
    css`
      .${MERGE_ACTIVE_NODE_CLASSNAME} &&& {
        height: 20px;
        opacity: 0.5;
        ${stepBoxShadowStyles} :last-of-type {
          margin-top: ${units()}px;
        }

        :not(:first-child),
        :not(:last-child) {
          margin: ${units()}px 0;
        }

        :hover {
          opacity: 1;
        }
      }
    `}
`;

export default StepReorderIndicatorContainer;
