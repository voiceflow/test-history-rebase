import { Node, Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { stopPropagation } from '@voiceflow/ui';
import React from 'react';

import Popper from '@/components/Popper';

import NoMatchAndNoReplyStepCopyList from '../../NoMatchAndNoReplyStepCopyList';
import Attachment from './StepAttachment';
import Item from './StepItem';

export interface NoMatchStepItemProps {
  portID?: Nullable<string>;
  noMatch: Realtime.NodeData.NoMatch;
}

const NoMatchStepItem: React.FC<NoMatchStepItemProps> = ({ noMatch, portID }) => {
  const isPath = noMatch.types.includes(Node.Utils.NoMatchType.PATH);

  return noMatch.types.length ? (
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
            noMatch.types.includes(Node.Utils.NoMatchType.REPROMPT) ? (
              <Attachment ref={ref} icon="noMatch" isActive={isOpened} onClick={stopPropagation(onToggle)} />
            ) : null
          }
        />
      )}
    </Popper>
  ) : null;
};

export default NoMatchStepItem;
