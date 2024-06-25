import type { Nullable } from '@voiceflow/base-types';
import { BaseNode } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { Popper, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { useArePromptsEmpty } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';
import { PATH } from '@/pages/Canvas/managers/components/NoReplyV2/constants';

import PromptsPreview from './PromptsPreview';
import StepButton from './StepButton';
import Item from './StepItem';

export interface NoReplyStepItemProps {
  portID?: Nullable<string>;
  noReply?: Nullable<Realtime.NodeData.NoReply>;
  nodeID: string;
  nestedWithIcon?: boolean;
}

const NoReplyStepItemV2: React.FC<NoReplyStepItemProps> = ({ nodeID, noReply, portID, nestedWithIcon }) => {
  const isPath = noReply?.types.includes(BaseNode.Utils.NoReplyType.PATH);
  const engine = React.useContext(EngineContext);
  const promptsAreEmpty = useArePromptsEmpty(noReply?.reprompts);

  const handleOpenEditor = () => engine?.setActive(nodeID, { nodeSubPath: PATH });

  if (!noReply?.types.length) return null;

  return (
    <Popper
      placement="right"
      renderContent={({ onClose }) => (
        <PromptsPreview
          title="No Reply"
          onClose={onClose}
          prompts={noReply.reprompts as any}
          onOpenEditor={handleOpenEditor}
        />
      )}
    >
      {({ ref, onToggle, isOpened }) => (
        <Item
          label={(isPath ? noReply.pathName : null) ?? 'No reply'}
          portID={isPath ? portID : null}
          v2
          nestedWithIcon={nestedWithIcon}
          portColor="#6e849a"
          attachment={
            noReply.types.includes(BaseNode.Utils.NoReplyType.REPROMPT) && !promptsAreEmpty ? (
              <StepButton ref={ref} icon="delay" isActive={isOpened} onClick={stopPropagation(onToggle)} />
            ) : null
          }
          parentActionsPath={PATH}
        />
      )}
    </Popper>
  );
};

export default NoReplyStepItemV2;
