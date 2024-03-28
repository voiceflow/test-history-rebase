import { Utils } from '@voiceflow/common';
import type { Intent } from '@voiceflow/dtos';
import { tid } from '@voiceflow/style';
import { Box, Divider, Scroll } from '@voiceflow/ui-next';
import React from 'react';

import { AIGenerateUtteranceButton } from '@/components/AI/AIGenerateUtteranceButton/AIGenerateUtteranceButton.component';
import { useAIGenerateUtterances } from '@/components/AI/hooks/ai-generate-utterances';
import { CMSFormDescription } from '@/components/CMS/CMSForm/CMSFormDescription/CMSFormDescription.component';
import { CMSFormListItem } from '@/components/CMS/CMSForm/CMSFormListItem/CMSFormListItem.component';
import { CMSFormName } from '@/components/CMS/CMSForm/CMSFormName/CMSFormName.component';
import { CMSFormSortableList } from '@/components/CMS/CMSForm/CMSFormSortableList/CMSFormSortableList.component';
import { IntentCreateRequiredEntityItem } from '@/components/Intent/IntentCreateRequiredEntityItem/IntentCreateRequiredEntityItem.component';
import { IntentRequiredEntitiesSection } from '@/components/Intent/IntentRequiredEntitiesSection/IntentRequiredEntitiesSection.component';
import { IntentUtterancesSection } from '@/components/Intent/IntentUtterancesSection/IntentUtterancesSection.component';
import { Modal } from '@/components/Modal';
import { useIntentDescriptionPlaceholder } from '@/hooks/intent.hook';
import { useAutoScrollListItemIntoView } from '@/hooks/scroll.hook';

import { modalsManager } from '../../../manager';
import { useIntentForm } from './IntentCreate.hook';
import { IIntentCreateModal } from './IntentCreate.interface';

export const IntentCreateModal = modalsManager.create<IIntentCreateModal, Intent>(
  'IntentCreateModal',
  () =>
    ({ api, type, name: nameProp, opened, hidden, folderID, animated, closePrevented }) => {
      const TEST_ID = 'create-intent-modal';

      const intentForm = useIntentForm({ nameProp, folderID, api });

      const aiGenerate = useAIGenerateUtterances({
        examples: intentForm.utterances,
        intentName: intentForm.nameState.value,
        onGenerated: (items) =>
          intentForm.utteranceState.setValue((prev) => [...items.map(({ text }) => ({ id: Utils.id.cuid.slug(), text })), ...prev]),
        onIntentNameSuggested: (suggestedName) => !intentForm.nameState.value && intentForm.nameState.setValue(suggestedName),
        successGeneratedMessage: 'Utterances generated',
      });

      const requiredEntityAutoScroll = useAutoScrollListItemIntoView();
      const descriptionPlaceholder = useIntentDescriptionPlaceholder();

      const onSubmit = () => {
        intentForm.onCreate({
          name: intentForm.nameState.value,
          utterances: intentForm.utterances,
          description: intentForm.descriptionState.value,
        });
      };

      const onRequiredEntityAdd = (entityID: string) => {
        const requiredEntity = intentForm.onEntityAdd(entityID);

        requiredEntityAutoScroll.setItemID(requiredEntity.id);
      };

      return (
        <Modal.Container
          type={type}
          opened={opened}
          hidden={hidden}
          animated={animated}
          onExited={api.remove}
          onEscClose={api.onEscClose}
          onEnterSubmit={onSubmit}
          testID={TEST_ID}
        >
          <Modal.Header title="Create intent" onClose={api.onClose} testID={tid(TEST_ID, 'header')} />

          <Scroll style={{ display: 'block' }}>
            <Modal.Body gap={16}>
              <CMSFormName
                value={intentForm.nameState.value}
                error={intentForm.nameState.error}
                testID={tid('intent', 'name')}
                autoFocus
                placeholder="Enter intent name"
                onValueChange={intentForm.nameState.setValue}
              />

              <CMSFormDescription
                value={intentForm.descriptionState.value}
                error={intentForm.descriptionState.error}
                testID={tid('intent', 'description')}
                minRows={1}
                placeholder={descriptionPlaceholder}
                onValueChange={intentForm.descriptionState.setValue}
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
              onRequiredEntityAdd={intentForm.onEntityAdd}
              onUtteranceImportMany={intentForm.onUtteranceImportMany}
              autoScrollToTopRevision={intentForm.utteranceAutoFocusKey}
            />

            {!!intentForm.utterances.length && (
              <Box pt={8} px={16} pb={16}>
                <AIGenerateUtteranceButton
                  isLoading={aiGenerate.fetching}
                  onGenerate={aiGenerate.onGenerate}
                  hasExtraContext={!!intentForm.nameState.value || !intentForm.isUtterancesListEmpty}
                />
              </Box>
            )}

            <Divider noPadding />

            <IntentRequiredEntitiesSection onAdd={onRequiredEntityAdd} entityIDs={intentForm.requiredEntityIDs}>
              <CMSFormSortableList
                items={intentForm.requiredEntities}
                getItemKey={(item) => item.id}
                onItemsReorder={intentForm.onEntityReorder}
                renderItem={({ ref, item, styles, dragContainerProps }) => (
                  <div {...dragContainerProps} ref={ref} style={{ transition: styles.transition }}>
                    <CMSFormListItem
                      pl={12}
                      ref={requiredEntityAutoScroll.itemRef(item.id)}
                      gap={4}
                      align="center"
                      onRemove={() => intentForm.onEntityRemove(item.entityID)}
                      testID={tid('intent', ['require-entities', 'item'])}
                    >
                      <IntentCreateRequiredEntityItem
                        entityID={item.entityID}
                        entityIDs={intentForm.requiredEntityIDs}
                        reprompts={intentForm.repromptsByEntityID[item.entityID]}
                        entityName={item.text}
                        intentName={intentForm.nameState.value}
                        utterances={intentForm.utterances}
                        attachments={intentForm.attachmentsPerEntityPerReprompt[item.entityID]}
                        onRepromptAdd={() => intentForm.onRepromptAdd(item.entityID)}
                        onEntityReplace={({ oldEntityID, entityID }) => intentForm.onEntityReplace(oldEntityID, entityID)}
                        onRepromptChange={(repromptID, data) => intentForm.onRepromptChange(repromptID, data)}
                        onRepromptDelete={(repromptID) => intentForm.onRepromptRemove(item.entityID, repromptID)}
                        automaticReprompt={intentForm.automaticReprompt}
                        onRepromptsGenerated={(reprompts) => intentForm.onRepromptsGenerated(item.entityID, reprompts)}
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
          </Scroll>

          <Modal.Footer>
            <Modal.Footer.Button variant="secondary" onClick={api.onClose} disabled={closePrevented} label="Cancel" testID={tid(TEST_ID, 'cancel')} />

            <Modal.Footer.Button
              label="Create intent"
              testID={tid(TEST_ID, 'create')}
              variant="primary"
              onClick={onSubmit}
              disabled={closePrevented}
              isLoading={closePrevented}
            />
          </Modal.Footer>
        </Modal.Container>
      );
    },
  { backdropDisabled: true }
);
