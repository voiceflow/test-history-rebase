import { BaseNode, Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Popper, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { hasValidPrompt } from '@/utils/prompt';

import NoMatchAndNoReplyStepCopyList from '../../NoMatchAndNoReplyStepCopyList';
import Attachment from './StepAttachment';
import Item from './StepItem';

export interface NoMatchStepItemProps {
  portID?: Nullable<string>;
  noMatch?: Nullable<Realtime.NodeData.NoMatch>;
}

const NoMatchStepItem: React.FC<NoMatchStepItemProps> = ({ noMatch, portID }) => {
  const isPath = noMatch?.types.includes(BaseNode.Utils.NoMatchType.PATH);

  return noMatch?.types.length ? (
    <Popper
      placement="right"
      renderContent={({ onClose }) => <NoMatchAndNoReplyStepCopyList prefix="Reprompt" onClick={onClose} reprompts={noMatch.reprompts as any} />}
    >
      {({ ref, onToggle, isOpened }) => (
        <Item
          label={(isPath ? noMatch.pathName : null) ?? 'No Match'}
          portID={isPath ? portID : null}
          portColor="#6e849a"
          attachment={
            noMatch.types.includes(BaseNode.Utils.NoMatchType.REPROMPT) && hasValidPrompt(noMatch.reprompts) ? (
              <Attachment ref={ref} icon="noMatch" isActive={isOpened} onClick={stopPropagation(onToggle)} />
            ) : null
          }
        />
      )}
    </Popper>
  ) : null;
};

export default NoMatchStepItem;
