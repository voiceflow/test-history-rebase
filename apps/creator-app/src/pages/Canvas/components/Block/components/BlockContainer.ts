import { MemberIcon } from '@voiceflow/ui';

import { HSLShades } from '@/constants';
import { styled, transition } from '@/hocs/styled';
import {
  CANVAS_COMMENTING_ENABLED_CLASSNAME,
  CANVAS_CREATING_LINK_CLASSNAME,
  CANVAS_SELECTING_GROUP_CLASSNAME,
  CANVAS_THREAD_OPEN_CLASSNAME,
  NODE_DISABLED_CLASSNAME,
  NODE_FOCUSED_CLASSNAME,
  NODE_HIGHLIGHTED_CLASSNAME,
  NODE_HOVERED_CLASSNAME,
  NODE_PROTOTYPE_HIGHLIGHTED_CLASSNAME,
  NODE_SELECTED_CLASSNAME,
  NODE_THREAD_TARGET_CLASSNAME,
} from '@/pages/Canvas/constants';
import { ClassName, Identifier } from '@/styles/constants';

import { BLOCK_CONTAINER_PADDING } from '../constants';

interface StyledBlockContainerProps {
  palette: HSLShades;
}

const BlockContainer = styled.div<StyledBlockContainerProps>`
  ${transition('background-color')}

  width: ${({ theme }) => theme.components.block.width}px;
  border-radius: 10px;
  cursor: pointer;
  border: solid 2px #fff;
  padding: 0 ${BLOCK_CONTAINER_PADDING}px ${BLOCK_CONTAINER_PADDING}px ${BLOCK_CONTAINER_PADDING}px;

  background-color: ${({ palette }) => palette[100]};
  position: relative;

  .${CANVAS_COMMENTING_ENABLED_CLASSNAME} & {
    cursor: crosshair;
  }

  .${CANVAS_COMMENTING_ENABLED_CLASSNAME}.${CANVAS_THREAD_OPEN_CLASSNAME} & {
    cursor: default;
  }

  ::before {
    display: block;
    border-radius: 10px;

    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;

    border: 1px solid ${({ palette }) => palette[200]};

    content: '';

    ${transition('box-shadow')}
  }

  &:hover::before {
    box-shadow: 0 4px 8px 0 rgba(17, 49, 96, 0.12);
    border-color: ${({ palette }) => palette[200]};
  }

  .${NODE_HIGHLIGHTED_CLASSNAME} &,
  .${CANVAS_CREATING_LINK_CLASSNAME} .${NODE_HOVERED_CLASSNAME} & {
    cursor: copy;
  }

  #${Identifier.CANVAS_CONTAINER}.${CANVAS_SELECTING_GROUP_CLASSNAME} & {
    cursor: inherit;
  }

  .${NODE_FOCUSED_CLASSNAME} &::before {
    box-shadow: 0 12px 32px 0 rgba(17, 49, 96, 0.2);
  }

  .${NODE_SELECTED_CLASSNAME} &,
  .${NODE_PROTOTYPE_HIGHLIGHTED_CLASSNAME} &,
  .${NODE_HIGHLIGHTED_CLASSNAME} &,
  .${NODE_THREAD_TARGET_CLASSNAME} &,
  .${CANVAS_CREATING_LINK_CLASSNAME} .${NODE_HOVERED_CLASSNAME}:not(.${NODE_DISABLED_CLASSNAME}) & {
    border-color: #3d82e2;

    ::before {
      display: none;
    }
  }

  .${CANVAS_CREATING_LINK_CLASSNAME} .${NODE_DISABLED_CLASSNAME} & {
    cursor: not-allowed;
  }

  ${MemberIcon} {
    position: absolute;
    top: 6px;
    left: 6px;
    z-index: 99;
    transform: translate(-50%, -50%);
  }

  #${Identifier.CANVAS_CONTAINER}.${CANVAS_SELECTING_GROUP_CLASSNAME} {
    .${ClassName.CANVAS_NODE}:not(.${NODE_FOCUSED_CLASSNAME}) &:hover::before {
      box-shadow: none;
      border-color: #fff;
    }

    .${ClassName.CANVAS_NODE}:not(.${NODE_DISABLED_CLASSNAME}) &:hover::before {
      box-shadow: none;
      border-color: #fff;
    }
  }
`;

export default BlockContainer;
