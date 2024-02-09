import { UtteranceText } from '@voiceflow/dtos';
import { tid } from '@voiceflow/style';
import { Divider, notify, Scroll } from '@voiceflow/ui-next';
import React from 'react';

import { CMSFormDescription } from '@/components/CMS/CMSForm/CMSFormDescription/CMSFormDescription.component';
import { CMSFormName } from '@/components/CMS/CMSForm/CMSFormName/CMSFormName.component';
import { useIntentDescriptionPlaceholder } from '@/components/Intent/IntentDescription/IntentDescription.hook';
import { IntentEditForm } from '@/components/Intent/IntentEditForm/IntentEditForm.component';
import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { isIntentBuiltIn } from '@/utils/intent.util';

import { modalsManager } from '../../manager';

const TEST_ID = 'edit-intent-modal';

export interface IIntentEditModal {
  intentID: string;
  newUtterances?: UtteranceText[];
}

export const IntentEditModal = modalsManager.create<IIntentEditModal>(
  'IntentEditModal',
  () =>
    ({ api, type, opened, hidden, intentID, animated, newUtterances, closePrevented }) => {
      const intent = useSelector(Designer.Intent.selectors.oneWithFormattedBuiltNameByID, { id: intentID });
      const intents = useSelector(Designer.Intent.selectors.allWithoutFallback);

      const patchIntent = useDispatch(Designer.Intent.effect.patchOne, intentID);
      const deleteIntent = useDispatch(Designer.Intent.effect.deleteOne, intentID);

      const descriptionPlaceholder = useIntentDescriptionPlaceholder();

      const onIntentSelect = (id: string) => {
        api.updateProps({ intentID: id }, { reopen: true });
      };

      const onNameChange = (name: string) => {
        if (!name) return;

        patchIntent({ name });
      };

      const onDescriptionChange = (description: string) => {
        if (!description) return;

        patchIntent({ description });
      };

      const onIntentDelete = async () => {
        api.close();

        await deleteIntent();

        notify.short.info('Deleted', { showIcon: false });
      };

      return (
        <Modal.Container
          type={type}
          opened={opened}
          hidden={hidden}
          animated={animated}
          onExited={api.remove}
          onEscClose={api.onEscClose}
          testID={TEST_ID}
        >
          <Modal.Header
            title="Edit intent"
            onClose={api.onClose}
            leftButton={
              <Modal.HeaderMenu
                items={intents}
                activeID={intentID}
                onSelect={onIntentSelect}
                notFoundLabel="intents"
                testID={tid(TEST_ID, 'select-intent')}
              />
            }
            secondaryButton={
              <Modal.HeaderMore options={[{ name: 'Delete', onClick: onIntentDelete, testID: 'delete' }]} testID={tid(TEST_ID, 'more')} />
            }
            testID={tid(TEST_ID, 'header')}
          />

          {intent ? (
            <Scroll style={{ display: 'block' }}>
              <Modal.Body gap={16}>
                <CMSFormName
                  value={intent.name}
                  disabled={isIntentBuiltIn(intentID)}
                  autoFocus={!newUtterances?.length}
                  placeholder="Enter intent name"
                  onValueChange={onNameChange}
                  testID={tid('intent', 'name')}
                />

                <CMSFormDescription
                  value={intent.description ?? ''}
                  minRows={1}
                  placeholder={descriptionPlaceholder}
                  onValueChange={onDescriptionChange}
                  testID={tid('intent', 'description')}
                />
              </Modal.Body>

              <Divider noPadding />

              <IntentEditForm intent={intent} newUtterances={newUtterances} />
            </Scroll>
          ) : (
            <Modal.Body testID={tid(TEST_ID, 'not-found')}>Intent not found</Modal.Body>
          )}

          <Modal.Footer>
            <Modal.Footer.Button label="Close" variant="secondary" onClick={api.onClose} disabled={closePrevented} testID={tid(TEST_ID, 'close')} />
          </Modal.Footer>
        </Modal.Container>
      );
    }
);
