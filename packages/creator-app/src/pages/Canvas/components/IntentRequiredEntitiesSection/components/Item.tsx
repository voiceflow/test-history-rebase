import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import * as GPT from '@/components/GPT';
import { useAreIntentPromptsEmpty } from '@/hooks/intent';

interface ItemProps {
  entity: Realtime.Slot;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  isActive?: boolean;
  contentRef?: React.Ref<HTMLDivElement>;
  intentEntity: Platform.Base.Models.Intent.Slot;
  onRemoveRequired: VoidFunction;
  onGeneratePrompt: VoidFunction;
}

const Item: React.FC<ItemProps> = ({ entity, onClick, isActive, contentRef, intentEntity, onRemoveRequired, onGeneratePrompt }) => {
  const hasError = useAreIntentPromptsEmpty(intentEntity.dialog.prompt);
  const entityReprompt = GPT.useGPTGenFeatures();

  const errorTooltip = !entityReprompt.isEnabled
    ? { content: 'Prompt is missing' }
    : {
        width: 232,
        content: (
          <TippyTooltip.FooterButton buttonText="Generate response" onClick={() => onGeneratePrompt()}>
            Entity reprompt missing.
          </TippyTooltip.FooterButton>
        ),
        position: 'bottom' as const,
        interactive: true,
      };

  return (
    <SectionV2.ListItem
      icon={hasError ? 'warning' : 'setV2'}
      action={<SectionV2.RemoveButton onClick={() => onRemoveRequired()} />}
      onClick={onClick}
      isActive={isActive}
      iconProps={{ color: hasError ? '#BF395B' : undefined }}
      contentRef={contentRef}
      iconTooltip={hasError ? errorTooltip : null}
      actionCentred
    >
      {entity.name}
    </SectionV2.ListItem>
  );
};

export default Item;
