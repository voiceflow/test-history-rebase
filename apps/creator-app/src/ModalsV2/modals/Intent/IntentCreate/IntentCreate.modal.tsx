import { Utils } from '@voiceflow/common';
import { Box, Divider, Text, Toggle, Tokens } from '@voiceflow/ui-next';
import React from 'react';

import { AIGenerateUtteranceButton } from '@/components/AI/AIGenerateUtteranceButton/AIGenerateUtteranceButton.component';
import { useAIGenerateUtterances } from '@/components/AI/hooks/ai-generate-utterances';
import { CMSFormName } from '@/components/CMS/CMSForm/CMSFormName/CMSFormName.component';
import { CMSFormSortableItem } from '@/components/CMS/CMSForm/CMSFormSortableItem/CMSFormSortableItem.component';
import { CMSFormSortableList } from '@/components/CMS/CMSForm/CMSFormSortableList/CMSFormSortableList.component';
import { IntentCreateRequiredEntityItem } from '@/components/Intent/IntentCreateRequiredEntityItem/IntentCreateRequiredEntityItem.component';
import { IntentRequiredEntitiesSection } from '@/components/Intent/IntentRequiredEntitiesSection/IntentRequiredEntitiesSection.component';
import { IntentUtterancesSection } from '@/components/Intent/IntentUtterancesSection/IntentUtterancesSection.component';
import { Modal } from '@/components/Modal';

import { modalsManager } from '../../../manager';
import { useIntentForm } from './IntentCreate.hook';

export interface IIntentCreateModal {
  name?: string;
  folderID: string | null;
}

export const IntentCreateModal = modalsManager.create<IIntentCreateModal>(
  'IntentCreateModal',
  () =>
    ({ api, type, name: nameProp, opened, hidden, folderID, animated, closePrevented }) => {
      const intentForm = useIntentForm({ nameProp, folderID, api });

      const aiGenerate = useAIGenerateUtterances({
        examples: intentForm.utterances,
        intentName: intentForm.name,
        onGenerated: (items) => intentForm.setUtterances((prev) => [...items.map(({ text }) => ({ id: Utils.id.cuid.slug(), text })), ...prev]),
        onIntentNameSuggested: (suggestedName) => !intentForm.name && intentForm.setName(suggestedName),
      });

      return (
        <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} onEscClose={api.close}>
          <Modal.Header title="Create Intent" onClose={api.close} />

          <CMSFormName
            pb={24}
            value={intentForm.name}
            error={intentForm.nameError}
            placeholder="Enter intent name"
            onValueChange={intentForm.setName}
          />

          <Divider />

          <IntentUtterancesSection
            utterances={intentForm.utterances}
            onUtteranceAdd={intentForm.onAddUtterance}
            onUtteranceEmpty={intentForm.onUtterancesListEmpty}
            onUtteranceDelete={intentForm.onRemoveUtterance}
            onUtteranceChange={intentForm.onChangeUtterance}
            autoScrollToTopRevision={intentForm.utteranceAutoFocusKey}
          />

          <Box px={16} pb={16}>
            <AIGenerateUtteranceButton
              isLoading={aiGenerate.fetching}
              onGenerate={aiGenerate.onGenerate}
              hasExtraContext={!!intentForm.name || !intentForm.isUtterancesListEmpty}
            />
          </Box>

          <Divider />

          <IntentRequiredEntitiesSection onAdd={intentForm.onEntityAdd} entityIDs={intentForm.requiredEntityIDs}>
            <CMSFormSortableList
              items={intentForm.requiredEntities}
              getItemKey={(item) => item.id}
              onItemsReorder={intentForm.onEntityReorder}
              renderItem={({ ref, item, styles, dragContainerProps }) => (
                <CMSFormSortableItem
                  ref={ref}
                  key={item.id}
                  style={styles}
                  onRemove={() => intentForm.onEntityRemove(item.id)}
                  dragButtonProps={dragContainerProps}
                >
                  <IntentCreateRequiredEntityItem
                    entityID={item.id}
                    entityIDs={intentForm.requiredEntityIDs}
                    reprompts={intentForm.repromptsByEntityID[item.id]}
                    entityName={item.text}
                    attachments={intentForm.attachmentsPerEntityPerReprompt[item.id]}
                    onRepromptAdd={() => intentForm.onRepromptAdd(item.id)}
                    onEntityReplace={({ oldEntityID, entityID }) => intentForm.onEntityReplace(oldEntityID, entityID)}
                    onRepromptChange={(repromptID, data) => intentForm.onRepromptChange(repromptID, data)}
                    onRepromptDelete={(repromptID) => intentForm.onRepromptRemove(item.id, repromptID)}
                    automaticReprompt={intentForm.automaticReprompt}
                    onRepromptAttachmentSelect={intentForm.onRepromptAttachmentSelect}
                    onRepromptsAttachmentRemove={intentForm.onRepromptsAttachmentRemove}
                    onRepromptVariantTypeChange={intentForm.onRepromptVariantTypeChange}
                    onRepromptAttachmentDuplicate={intentForm.onRepromptAttachmentDuplicate}
                  />
                </CMSFormSortableItem>
              )}
            />
          </IntentRequiredEntitiesSection>

          <Divider />

          <Box align="center" justify="space-between" pl={24} pr={20} py={12}>
            <Text style={!intentForm.automaticReprompt ? { color: Tokens.colors.neutralDark.neutralsDark100 } : {}}>Automatically reprompt</Text>
            <Toggle value={intentForm.automaticReprompt} onValueChange={intentForm.setAutomaticReprompt} />
          </Box>

          <Modal.Footer>
            <Modal.Footer.Button variant="secondary" onClick={api.close} disabled={closePrevented} label="Cancel" />

            <Modal.Footer.Button
              label="Create Intent"
              variant="primary"
              onClick={() => intentForm.onCreate({ name: intentForm.name })}
              disabled={closePrevented}
            />
          </Modal.Footer>
        </Modal>
      );
    }
);
