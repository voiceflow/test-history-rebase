import { BaseNode, Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Popper, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { useArePromptsEmpty } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';
import NoMatchV2 from '@/pages/Canvas/managers/components/NoMatchV2';

import PromptsPreview from './PromptsPreview';
import StepButton from './StepButton';
import Item from './StepItem';

export interface NoMatchStepItemProps {
  portID?: Nullable<string>;
  noMatch: Nullable<Realtime.NodeData.NoMatch>;
  nodeID: string;
  nestedWithIcon?: boolean;
}

const NoMatchStepItemV2: React.FC<NoMatchStepItemProps> = ({ nodeID, noMatch, portID, nestedWithIcon }) => {
  const isPath = noMatch?.types.includes(BaseNode.Utils.NoMatchType.PATH);
  const engine = React.useContext(EngineContext);
  const promptsAreEmpty = useArePromptsEmpty(noMatch?.reprompts);

  const handleOpenEditor = () => engine?.setActive(nodeID, { nodeSubPath: NoMatchV2.PATH });

  if (!noMatch?.types.length) return null;

  return (
    <Popper
      placement="right"
      renderContent={({ onClose }) => (
        <PromptsPreview title="No Match" onClose={onClose} prompts={noMatch.reprompts as any} onOpenEditor={handleOpenEditor} />
      )}
    >
      {({ ref, onToggle, isOpened }) => (
        <Item
          nestedWithIcon={nestedWithIcon}
          label={(isPath ? noMatch.pathName : null) ?? 'No match'}
          portID={isPath ? portID : null}
          portColor="#6e849a"
          attachment={
            noMatch.types.includes(BaseNode.Utils.NoMatchType.REPROMPT) && !promptsAreEmpty ? (
              <StepButton ref={ref} icon="noMatch" isActive={isOpened} onClick={stopPropagation(onToggle)} />
            ) : null
          }
          v2
          parentActionsPath={NoMatchV2.PATH}
        />
      )}
    </Popper>
  );
};

export default NoMatchStepItemV2;
