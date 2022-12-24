import { styled } from '@/hocs/styled';
import { ClassName } from '@/styles/constants';

import {
  CANVAS_CREATING_LINK_CLASSNAME,
  CANVAS_PROTOTYPE_RUNNING_CLASSNAME,
  NODE_HOVERED_CLASSNAME,
  NODE_MERGE_TARGET_CLASSNAME,
} from '../../constants';

export const Container = styled.div`
  transition: max-width 0.12s ease, margin-right 0.12s ease, opacity 0.12s ease;
  max-width: 0;
  margin-right: 0;
  opacity: 0;
  overflow: hidden;
  overflow: clip;

  .${CANVAS_PROTOTYPE_RUNNING_CLASSNAME} & {
    display: none;
  }

  .${ClassName.CANVAS_BLOCK}:hover & {
    max-width: 16px;
    opacity: 1;

    &:not(:last-child) {
      margin-right: 12px;
    }
  }

  .${NODE_HOVERED_CLASSNAME} &,
  .${NODE_MERGE_TARGET_CLASSNAME} &,
  .${CANVAS_CREATING_LINK_CLASSNAME} & {
    pointer-events: none;
    max-width: 0 !important;
    margin-right: 0 !important;
  }
`;
