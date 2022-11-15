import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { hasValidPrompt } from '@/utils/prompt';

interface ItemProps {
  entity: Realtime.Slot;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  isActive?: boolean;
  contentRef?: React.Ref<HTMLDivElement>;
  intentEntity: Platform.Base.Models.Intent.Slot;
  onRemoveRequired: (slotID: string) => void;
}

const Item: React.FC<ItemProps> = ({ entity, onClick, isActive, contentRef, intentEntity, onRemoveRequired }) => {
  const hasError = React.useMemo(() => !hasValidPrompt(intentEntity.dialog.prompt), [intentEntity.dialog.prompt]);

  return (
    <SectionV2.ListItem
      icon="setV2"
      action={<SectionV2.RemoveButton onClick={() => onRemoveRequired(intentEntity.id)} />}
      onClick={onClick}
      isActive={isActive}
      contentRef={contentRef}
      iconWarning={hasError ? 'Prompt is missing' : null}
      actionCentred
    >
      {entity.name}
    </SectionV2.ListItem>
  );
};

export default Item;
