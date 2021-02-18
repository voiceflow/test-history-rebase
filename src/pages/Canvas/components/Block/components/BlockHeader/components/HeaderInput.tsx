import React from 'react';

import EditableText, { EditableTextAPI, EditableTextProps } from '@/components/EditableText';
import { BlockVariant } from '@/constants/canvas';
import { styled, transition, withBlockVariantStyle } from '@/hocs';
import {
  CANVAS_COMMENTING_ENABLED_CLASSNAME,
  CANVAS_CREATING_LINK_CLASSNAME,
  CANVAS_MERGING_CLASSNAME,
  CANVAS_SELECTING_GROUP_CLASSNAME,
  CANVAS_THREAD_OPEN_CLASSNAME,
  NODE_ACTIVE_CLASSNAME,
} from '@/pages/Canvas/constants';

type HeaderInputProps = EditableTextProps & {
  canEdit?: boolean;
  variant: BlockVariant;
  viewOnlyMode: boolean;
};

const HeaderInput = styled(
  // eslint-disable-next-line react/display-name
  React.forwardRef<EditableTextAPI, HeaderInputProps>(({ canEdit, variant, viewOnlyMode, ...props }, ref) => <EditableText {...props} ref={ref} />)
)<HeaderInputProps>`
  ${transition('background')};

  font-size: 15px;
  font-weight: 600;
  padding: 0 5px;
  border-radius: 3px;
  cursor: text;
  box-sizing: content-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: ${({ readOnly }) => readOnly && 'none'};
  pointer-events: ${({ viewOnlyMode }) => viewOnlyMode && 'none'};
  color: ${withBlockVariantStyle((variant) => variant.color)};

  .${CANVAS_MERGING_CLASSNAME} &,
  .${CANVAS_SELECTING_GROUP_CLASSNAME} &,
  .${CANVAS_CREATING_LINK_CLASSNAME} & {
    pointer-events: none;
  }

  .${CANVAS_COMMENTING_ENABLED_CLASSNAME} & {
    cursor: crosshair;
  }

  .${CANVAS_COMMENTING_ENABLED_CLASSNAME}.${CANVAS_THREAD_OPEN_CLASSNAME} & {
    cursor: default;
  }

  .${NODE_ACTIVE_CLASSNAME} & {
    color: ${withBlockVariantStyle((variant) => variant.activeColor)};
  }

  :hover {
    background: ${({ theme, variant, canEdit }) => canEdit && theme.components.block.variants[variant].editTitleColor};
  }

  :focus-within {
    background: ${({ theme, variant, canEdit, readOnly }) => !readOnly && canEdit && theme.components.block.variants[variant].editTitleColor};
  }

  input {
    text-align: center;
    max-width: 100%;
  }
`;

export default React.memo(HeaderInput);
