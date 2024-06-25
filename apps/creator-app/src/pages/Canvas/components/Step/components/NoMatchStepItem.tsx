import type { Nullable } from '@voiceflow/base-types';
import { BaseNode } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { Popper, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { useArePromptsEmpty } from '@/hooks';
import NoMatchV2 from '@/pages/Canvas/managers/components/NoMatchV2';

import NoMatchAndNoReplyStepCopyList from '../../NoMatchAndNoReplyStepCopyList';
import Attachment from './StepAttachment';
import Item from './StepItem';

export interface NoMatchStepItemProps {
  portID?: Nullable<string>;
  noMatch?: Nullable<Realtime.NodeData.NoMatch>;
}

const NoMatchStepItem: React.FC<NoMatchStepItemProps> = ({ noMatch, portID }) => {
  const isPath = noMatch?.types.includes(BaseNode.Utils.NoMatchType.PATH);
  const promptsAreEmpty = useArePromptsEmpty(noMatch?.reprompts);

  return noMatch?.types.length ? (
    <Popper
      placement="right"
      renderContent={({ onClose }) => (
        <NoMatchAndNoReplyStepCopyList prefix="Reprompt" onClick={onClose} reprompts={noMatch.reprompts as any} />
      )}
    >
      {({ ref, onToggle, isOpened }) => (
        <Item
          label={(isPath ? noMatch.pathName : null) ?? 'No match'}
          portID={isPath ? portID : null}
          portColor="#6e849a"
          attachment={
            noMatch.types.includes(BaseNode.Utils.NoMatchType.REPROMPT) && !promptsAreEmpty ? (
              <Attachment ref={ref} icon="noMatch" isActive={isOpened} onClick={stopPropagation(onToggle)} />
            ) : null
          }
          parentActionsPath={NoMatchV2.PATH}
        />
      )}
    </Popper>
  ) : null;
};

export default NoMatchStepItem;
