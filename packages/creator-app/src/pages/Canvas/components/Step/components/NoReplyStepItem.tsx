import { Node, Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { stopPropagation } from '@voiceflow/ui';
import React from 'react';

import Popper from '@/components/Popper';

import NoMatchAndNoReplyStepCopyList from '../../NoMatchAndNoReplyStepCopyList';
import Attachment from './StepAttachment';
import Item from './StepItem';

export interface NoReplyStepItemProps {
  portID?: Nullable<string>;
  noReply?: Nullable<Realtime.NodeData.NoReply>;
}

const NoReplyStepItem: React.FC<NoReplyStepItemProps> = ({ noReply, portID }) => {
  const isPath = noReply?.types.includes(Node.Utils.NoReplyType.PATH);

  return noReply?.types.length ? (
    <Popper
      placement="right"
      renderContent={({ onClose }) => <NoMatchAndNoReplyStepCopyList prefix="No Reply" onClick={onClose} reprompts={noReply.reprompts as any} />}
    >
      {({ ref, onToggle, isOpened }) => (
        <Item
          label={(isPath ? noReply.pathName : null) ?? 'No Reply'}
          portID={isPath ? portID : null}
          portColor="#6e849a"
          attachment={
            noReply.types.includes(Node.Utils.NoReplyType.REPROMPT) ? (
              <Attachment ref={ref} icon="noReply" isActive={isOpened} onClick={stopPropagation(onToggle)} />
            ) : null
          }
        />
      )}
    </Popper>
  ) : null;
};

export default NoReplyStepItem;
