import { UtteranceText } from '@voiceflow/dtos';
import { Divider, Scroll, toast } from '@voiceflow/ui-next';
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

        toast.info('Deleted', { showIcon: false });
      };

      return (
        <Modal.Container type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} onEscClose={api.onEscClose}>
          <Modal.Header
            title="Edit intent"
            onClose={api.onClose}
            leftButton={<Modal.HeaderMenu items={intents} activeID={intentID} onSelect={onIntentSelect} notFoundLabel="intents" />}
            secondaryButton={<Modal.HeaderMore options={[{ name: 'Delete', onClick: onIntentDelete }]} />}
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
                />

                <CMSFormDescription
                  value={intent.description ?? ''}
                  minRows={1}
                  onValueChange={onDescriptionChange}
                  placeholder={descriptionPlaceholder}
                />
              </Modal.Body>

              <Divider noPadding />

              <IntentEditForm intent={intent} newUtterances={newUtterances} />
            </Scroll>
          ) : (
            <Modal.Body>Intent not found</Modal.Body>
          )}

          <Modal.Footer>
            <Modal.Footer.Button label="Close" variant="secondary" onClick={api.onClose} disabled={closePrevented} />
          </Modal.Footer>
        </Modal.Container>
      );
    }
);
