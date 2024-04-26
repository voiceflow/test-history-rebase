import { Flex, MemberIcon } from '@voiceflow/ui';

import EditableText from '@/components/EditableText';
import type { HSLShades } from '@/constants';
import { styled, transition } from '@/hocs/styled';
import {
  CANVAS_COMMENTING_ENABLED_CLASSNAME,
  CANVAS_CREATING_LINK_CLASSNAME,
  CANVAS_PROTOTYPE_RUNNING_CLASSNAME,
  CANVAS_SELECTING_GROUP_CLASSNAME,
  CANVAS_THREAD_OPEN_CLASSNAME,
  NODE_ACTIVE_CLASSNAME,
  NODE_DISABLED_CLASSNAME,
  NODE_FOCUSED_CLASSNAME,
  NODE_HIGHLIGHTED_CLASSNAME,
  NODE_HOVERED_CLASSNAME,
  NODE_MERGE_TARGET_CLASSNAME,
  NODE_PROTOTYPE_HIGHLIGHTED_CLASSNAME,
  NODE_SELECTED_CLASSNAME,
  NODE_THREAD_TARGET_CLASSNAME,
} from '@/pages/Canvas/constants';
import { Identifier } from '@/styles/constants';

interface PaletteProps {
  palette: HSLShades;
}

export const PlayContainer = styled.div`
  transition: opacity 0.12s ease;
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

export const IconContainer = styled.div`
  transition: opacity 0.12s ease;
  position: absolute;
  opacity: 0.999;
  pointer-events: all;
`;

export const Container = styled.div<PaletteProps>`
  ${transition('box-shadow', 'background-color')}

  position: relative;
  box-shadow: inset 0 -1px 0 0 rgba(0, 0, 0, 0.32);
  background-color: ${({ palette }) => palette[700]};
  border-radius: 22px;
  cursor: pointer;
  opacity: 1;

  .${CANVAS_COMMENTING_ENABLED_CLASSNAME} & {
    cursor: crosshair;
  }

  .${CANVAS_COMMENTING_ENABLED_CLASSNAME}.${CANVAS_THREAD_OPEN_CLASSNAME} & {
    cursor: default;
  }

  .${NODE_HIGHLIGHTED_CLASSNAME} &,
  .${CANVAS_CREATING_LINK_CLASSNAME} .${NODE_HOVERED_CLASSNAME} & {
    cursor: copy;
  }

  #${Identifier.CANVAS_CONTAINER}.${CANVAS_SELECTING_GROUP_CLASSNAME} & {
    cursor: inherit;
  }

  .${NODE_FOCUSED_CLASSNAME} &,
  .${NODE_SELECTED_CLASSNAME} &,
  .${NODE_PROTOTYPE_HIGHLIGHTED_CLASSNAME} &,
  .${NODE_HIGHLIGHTED_CLASSNAME} &,
  .${NODE_THREAD_TARGET_CLASSNAME} &,
  .${CANVAS_CREATING_LINK_CLASSNAME} .${NODE_HOVERED_CLASSNAME}:not(.${NODE_DISABLED_CLASSNAME}) & {
    box-shadow:
      inset 0 -1px 0 0 rgba(0, 0, 0, 0.32),
      0 0 0 2px #fff,
      0 0 0 4px #3d82e2;
  }

  &.${NODE_ACTIVE_CLASSNAME} {
    box-shadow:
      inset 0 -1px 0 0 rgba(0, 0, 0, 0.32),
      0 0 0 2px #fff,
      0 0 0 4px #3d82e2;
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

  :hover {
    ${PlayContainer} {
      opacity: 0.999;
      pointer-events: all;
    }

    ${IconContainer} {
      opacity: 0;
      pointer-events: none;
    }
  }

  .${CANVAS_PROTOTYPE_RUNNING_CLASSNAME} &,
  .${NODE_HOVERED_CLASSNAME} &,
  .${NODE_MERGE_TARGET_CLASSNAME} &,
  .${CANVAS_CREATING_LINK_CLASSNAME} & {
    :hover {
      ${PlayContainer} {
        opacity: 0;
        pointer-events: none;
      }

      ${IconContainer} {
        opacity: 0.999;
        pointer-events: all;
      }
    }
  }
`;

export const Header = styled(Flex)`
  height: 44px;
  min-width: 44px;
  padding: 12px 20px;
  border-radius: 22px;
`;

export const IconsContainer = styled.div<PaletteProps>`
  position: relative;
  width: 16px;
  height: 16px;
  margin-right: 12px;
  color: ${({ palette }) => palette[100]};
`;

interface LabelProps extends PaletteProps {
  isPlaceholder?: boolean;
}

export const Label = styled(EditableText)<LabelProps>`
  max-width: 220px;
  overflow: hidden;
  font-size: 15px;
  font-weight: 600;
  color: ${({ palette, isPlaceholder }) => (isPlaceholder ? palette[300] : palette[50])};
  text-overflow: ellipsis;
  white-space: nowrap;

  span& {
    padding-right: 2px;
  }

  input {
    max-width: 220px !important;
    color: ${({ palette }) => palette[50]};

    ::placeholder {
      font-weight: 600 !important;
      color: ${({ palette }) => palette[300]} !important;
    }
  }
`;

export const PortContainer = styled(Flex)`
  width: 44px;
  height: 44px;
  margin: -12px -20px -12px 0;
  border-top-right-radius: 22px;
  border-bottom-right-radius: 22px;

  > div {
    border-top-right-radius: 22px;
    border-bottom-right-radius: 22px;
  }
`;
