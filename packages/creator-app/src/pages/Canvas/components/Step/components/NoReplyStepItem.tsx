import { BaseNode, Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Popper, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { useArePromptsEmpty } from '@/hooks';
import { PATH } from '@/pages/Canvas/managers/components/NoReplyV2/constants';

import NoMatchAndNoReplyStepCopyList from '../../NoMatchAndNoReplyStepCopyList';
import Attachment from './StepAttachment';
import Item from './StepItem';

export interface NoReplyStepItemProps {
  portID?: Nullable<string>;
  noReply?: Nullable<Realtime.NodeData.NoReply>;
}

const NoReplyStepItem: React.FC<NoReplyStepItemProps> = ({ noReply, portID }) => {
  const isPath = noReply?.types.includes(BaseNode.Utils.NoReplyType.PATH);
  const promptsAreEmpty = useArePromptsEmpty(noReply?.reprompts);

  return noReply?.types.length ? (
    <Popper
      placement="right"
      renderContent={({ onClose }) => <NoMatchAndNoReplyStepCopyList prefix="No Reply" onClick={onClose} reprompts={noReply.reprompts as any} />}
    >
      {({ ref, onToggle, isOpened }) => (
        <Item
          label={(isPath ? noReply.pathName : null) ?? 'No reply'}
          portID={isPath ? portID : null}
          portColor="#6e849a"
          attachment={
            noReply.types.includes(BaseNode.Utils.NoReplyType.REPROMPT) && !promptsAreEmpty ? (
              <Attachment ref={ref} icon="delay" isActive={isOpened} onClick={stopPropagation(onToggle)} />
            ) : null
          }
          parentActionsPath={PATH}
        />
      )}
    </Popper>
  ) : null;
};

export default NoReplyStepItem;
