import { Utils } from '@voiceflow/common';
import type { Intent } from '@voiceflow/dtos';
import { Box, Divider } from '@voiceflow/ui-next';
import React from 'react';

import { AIGenerateUtteranceButton } from '@/components/AI/AIGenerateUtteranceButton/AIGenerateUtteranceButton.component';
import { useAIGenerateUtterances } from '@/components/AI/hooks/ai-generate-utterances';
import { CMSFormListItem } from '@/components/CMS/CMSForm/CMSFormListItem/CMSFormListItem.component';
import { CMSFormName } from '@/components/CMS/CMSForm/CMSFormName/CMSFormName.component';
import { CMSFormSortableList } from '@/components/CMS/CMSForm/CMSFormSortableList/CMSFormSortableList.component';
import { IntentCreateRequiredEntityItem } from '@/components/Intent/IntentCreateRequiredEntityItem/IntentCreateRequiredEntityItem.component';
import { IntentRequiredEntitiesSection } from '@/components/Intent/IntentRequiredEntitiesSection/IntentRequiredEntitiesSection.component';
import { IntentUtterancesSection } from '@/components/Intent/IntentUtterancesSection/IntentUtterancesSection.component';
import { Modal } from '@/components/Modal';

import { modalsManager } from '../../../manager';
import { useIntentForm } from './IntentCreate.hook';
import { IIntentCreateModal } from './IntentCreate.interface';

export const IntentCreateModal = modalsManager.create<IIntentCreateModal, Intent>(
  'IntentCreateModal',
  () =>
    ({ api, type, name: nameProp, opened, hidden, folderID, animated, closePrevented }) => {
      const intentForm = useIntentForm({ nameProp, folderID, api });

      const aiGenerate = useAIGenerateUtterances({
        examples: intentForm.utterances,
        intentName: intentForm.name,
        onGenerated: (items) =>
          intentForm.utteranceState.setValue((prev) => [...items.map(({ text }) => ({ id: Utils.id.cuid.slug(), text })), ...prev]),
        onIntentNameSuggested: (suggestedName) => !intentForm.name && intentForm.setName(suggestedName),
      });

      return (
        <Modal.Container type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} onEscClose={api.close}>
          <Modal.Header title="Create intent" onClose={api.close} />

          <Modal.Body>
            <CMSFormName
              value={intentForm.name}
              error={intentForm.nameError}
              autoFocus
              placeholder="Enter intent name"
              onValueChange={intentForm.setName}
            />
          </Modal.Body>

          <Divider noPadding />

          <IntentUtterancesSection
            utterances={intentForm.utterances}
            autoFocusKey={intentForm.utteranceAutoFocusKey}
            onUtteranceAdd={intentForm.onUtteranceAdd}
            utterancesError={intentForm.utterancesError}
            onUtteranceEmpty={intentForm.onUtterancesListEmpty}
            onUtteranceRemove={intentForm.onUtteranceRemove}
            onUtteranceChange={intentForm.onUtteranceChange}
            autoScrollToTopRevision={intentForm.utteranceAutoFocusKey}
          />

          {!!intentForm.utterances.length && (
            <Box px={16} pb={16}>
              <AIGenerateUtteranceButton
                isLoading={aiGenerate.fetching}
                onGenerate={aiGenerate.onGenerate}
                hasExtraContext={!!intentForm.name || !intentForm.isUtterancesListEmpty}
              />
            </Box>
          )}

          <Divider noPadding />

          <IntentRequiredEntitiesSection onAdd={intentForm.onEntityAdd} entityIDs={intentForm.requiredEntityIDs}>
            <CMSFormSortableList
              items={intentForm.requiredEntities}
              getItemKey={(item) => item.id}
              onItemsReorder={intentForm.onEntityReorder}
              renderItem={({ ref, item, styles, dragContainerProps }) => (
                <div {...dragContainerProps} ref={ref} style={{ transition: styles.transition }}>
                  <CMSFormListItem pl={12} gap={4} align="center" onRemove={() => intentForm.onEntityRemove(item.entityID)}>
                    <IntentCreateRequiredEntityItem
                      entityID={item.entityID}
                      entityIDs={intentForm.requiredEntityIDs}
                      reprompts={intentForm.repromptsByEntityID[item.entityID]}
                      entityName={item.text}
                      attachments={intentForm.attachmentsPerEntityPerReprompt[item.entityID]}
                      onRepromptAdd={() => intentForm.onRepromptAdd(item.entityID)}
                      onEntityReplace={({ oldEntityID, entityID }) => intentForm.onEntityReplace(oldEntityID, entityID)}
                      onRepromptChange={(repromptID, data) => intentForm.onRepromptChange(repromptID, data)}
                      onRepromptDelete={(repromptID) => intentForm.onRepromptRemove(item.entityID, repromptID)}
                      automaticReprompt={intentForm.automaticReprompt}
                      onRepromptAttachmentSelect={intentForm.onRepromptAttachmentSelect}
                      onRepromptsAttachmentRemove={intentForm.onRepromptsAttachmentRemove}
                      onRepromptVariantTypeChange={intentForm.onRepromptVariantTypeChange}
                      onRepromptAttachmentDuplicate={intentForm.onRepromptAttachmentDuplicate}
                    />
                  </CMSFormListItem>
                </div>
              )}
            />
          </IntentRequiredEntitiesSection>

          {/* <Divider noPadding />

          <Box align="center" justify="space-between" pl={24} pr={20} py={12}>
            <Text style={!intentForm.automaticReprompt ? { color: Tokens.colors.neutralDark.neutralsDark100 } : {}}>Automatically reprompt</Text>
            <Toggle value={intentForm.automaticReprompt} onValueChange={intentForm.setAutomaticReprompt} />
          </Box> */}

          <Modal.Footer>
            <Modal.Footer.Button variant="secondary" onClick={api.close} disabled={closePrevented} label="Cancel" />

            <Modal.Footer.Button
              label="Create Intent"
              variant="primary"
              onClick={() => intentForm.onCreate({ name: intentForm.name, utterances: intentForm.utterances })}
              disabled={closePrevented}
              isLoading={closePrevented}
            />
          </Modal.Footer>
        </Modal.Container>
      );
    }
);
