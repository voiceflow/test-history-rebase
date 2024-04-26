import React from 'react';

import type { EditableTextProps } from '@/components/EditableText';
import TextArea from '@/components/TextArea';
import type { HSLShades } from '@/constants';
import { css, styled, transition } from '@/hocs/styled';
import {
  CANVAS_COMMENTING_ENABLED_CLASSNAME,
  CANVAS_CREATING_LINK_CLASSNAME,
  CANVAS_MERGING_CLASSNAME,
  CANVAS_SELECTING_GROUP_CLASSNAME,
  CANVAS_THREAD_OPEN_CLASSNAME,
} from '@/pages/Canvas/constants';

export interface BlockHeaderProps {
  palette: HSLShades;
}

export interface HeaderInputProps extends EditableTextProps, BlockHeaderProps {}

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

  background: ${({ palette }) => palette[200]};

  border: none !important;
  box-shadow: none;
  min-height: 23px;
  line-height: 1.5;

  color: ${({ palette }) => palette[700]};
`;

export default React.memo(HeaderInput);
