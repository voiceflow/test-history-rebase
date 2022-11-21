import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Popper, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import IntentPromptForm from '@/components/IntentPromptForm';
import { TextEditorVariablesPopoverProvider } from '@/contexts';
import IntentRequiredEntitiesSection from '@/pages/Canvas/components/IntentRequiredEntitiesSection';

interface RequiredEntityProps {
  entity: Realtime.Slot;
  entities: Realtime.Slot[];
  intentEntity: Platform.Base.Models.Intent.Slot;
  onChangeDialog: (slotID: string, dialog: Partial<Platform.Base.Models.Intent.SlotDialog>) => void;
  onRemoveRequired: (slotID: string) => void;
}

const RequiredEntity: React.FC<RequiredEntityProps> = ({ entity, entities, intentEntity, onChangeDialog, onRemoveRequired }) => {
  // onBlur event can be fired after the user clicks on the remove button
  // in this case prompt will not be removed, using ref to prevent that
  const removedRef = React.useRef(false);

  const setRemoved = (value: boolean) => () => {
    removedRef.current = value;
  };

  return (
    <Popper
      width="350px"
      placement="left-start"
      portalNode={document.body}
      renderContent={({ onClose }) => (
        <Popper.Content>
          <SectionV2.ActionCollapseSection
            title={<SectionV2.Title bold>Entity reprompt</SectionV2.Title>}
            action={
              <SectionV2.RemoveButton
                onClick={Utils.functional.chainVoid(setRemoved(true), onClose, () => onChangeDialog(entity.id, { prompt: [] }))}
              />
            }
            collapsed={false}
            headerProps={{ px: 20 }}
            contentProps={{ px: 20, bottomOffset: 2 }}
          >
            <TextEditorVariablesPopoverProvider value={document.body}>
              <IntentPromptForm
                slots={entities}
                prompt={intentEntity.dialog.prompt ?? []}
                autofocus
                onChange={(prompt) => !removedRef.current && onChangeDialog(intentEntity.id, { prompt })}
                placeholder="Enter entity reprompt"
              />
            </TextEditorVariablesPopoverProvider>
          </SectionV2.ActionCollapseSection>
        </Popper.Content>
      )}
    >
      {({ ref, onToggle, isOpened }) => (
        <IntentRequiredEntitiesSection.Item
          entity={entity}
          onClick={Utils.functional.chainVoid(setRemoved(false), onToggle)}
          isActive={isOpened}
          contentRef={ref}
          intentEntity={intentEntity}
          onRemoveRequired={onRemoveRequired}
        />
      )}
    </Popper>
  );
};

export default RequiredEntity;
