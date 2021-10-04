import React from 'react';

import { EditableTextProps } from '@/components/EditableText';
import TextArea from '@/components/TextArea';
import { BlockVariant } from '@/constants/canvas';
import { css, styled, transition, withBlockVariantStyle } from '@/hocs';
import {
  CANVAS_COMMENTING_ENABLED_CLASSNAME,
  CANVAS_CREATING_LINK_CLASSNAME,
  CANVAS_MERGING_CLASSNAME,
  CANVAS_SELECTING_GROUP_CLASSNAME,
  CANVAS_THREAD_OPEN_CLASSNAME,
  NODE_ACTIVE_CLASSNAME,
} from '@/pages/Canvas/constants';

export interface BlockHeaderProps {
  nodeID: string;
  variant: BlockVariant;
}

export type HeaderInputProps = EditableTextProps & BlockHeaderProps;

export const headerInputStyles = css`
  ${transition('background')};

  padding: 4px 8px;
  border-radius: 5px;
  font-size: 15px;
  font-weight: 600;
  cursor: text;
  box-sizing: border-box;

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
`;

const HeaderInput = styled(TextArea)<HeaderInputProps>`
  ${headerInputStyles};

  background: ${({ theme, variant }) => theme.components.block.variants[variant].editTitleColor};

  border: none !important;
  box-shadow: none;
  min-height: 23px;
  line-height: 1.5;

  color: ${withBlockVariantStyle((variant) => variant.color)};

  :focus-within {
    background: ${({ theme, variant }) => theme.components.block.variants[variant].editTitleColor};
  }

  .${NODE_ACTIVE_CLASSNAME}[data-node-id="${({ nodeID }) => nodeID}"] && {
    color: ${withBlockVariantStyle((variant) => variant.activeColor)};
  }
`;

export default React.memo(HeaderInput);
