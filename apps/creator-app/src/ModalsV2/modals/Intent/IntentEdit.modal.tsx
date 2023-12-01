import { Utils } from '@voiceflow/common';
import { UtteranceText } from '@voiceflow/dtos';
import { Divider } from '@voiceflow/ui-next';
import React, { useMemo } from 'react';

import { CMSFormDescription } from '@/components/CMS/CMSForm/CMSFormDescription/CMSFormDescription.component';
import { CMSFormName } from '@/components/CMS/CMSForm/CMSFormName/CMSFormName.component';
import { IntentEditForm } from '@/components/Intent/IntentEditForm/IntentEditForm.component';
import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useEditIntentValidator } from '@/hooks/intent.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { isBuiltInIntent } from '@/utils/intent';

import { modalsManager } from '../../manager';

export interface IIntentEditModal {
  intentID: string;
  newUtterances?: UtteranceText[];
}

export const IntentEditModal = modalsManager.create<IIntentEditModal>(
  'IntentEditModal',
  () =>
    ({ api, type, opened, hidden, intentID, animated, newUtterances, closePrevented }) => {
      const intent = useSelector(Designer.Intent.selectors.oneByID, { id: intentID });
      const intents = useSelector(Designer.Intent.selectors.all);

      const patchIntent = useDispatch(Designer.Intent.effect.patchOne, intentID);
      const deleteIntent = useDispatch(Designer.Intent.effect.deleteOne, intentID);

      const editIntentValidator = useEditIntentValidator(intent);

      const isBuiltIn = useMemo(() => isBuiltInIntent(intentID), [intentID]);

      const onIntentSelect = (id: string) => {
        if (!editIntentValidator.isValid()) return;

        api.updateProps({ intentID: id }, { reopen: true });
      };

      const onNameChange = (name: string) => {
        editIntentValidator.resetNameError();

        if (name) {
          patchIntent({ name });
        }
      };

      const onDescriptionChange = (description: string) => {
        editIntentValidator.resetDescriptionError();

        if (description) {
          patchIntent({ description });
        }
      };

      api.useOnCloseRequest(editIntentValidator.isValid);

      return (
        <Modal.Container type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} onEscClose={api.close}>
          <Modal.Header
            title="Edit intent"
            onClose={api.close}
            leftButton={<Modal.HeaderMenu items={intents} activeID={intentID} onSelect={onIntentSelect} />}
            secondaryButton={<Modal.HeaderMore options={[{ name: 'Delete', onClick: Utils.functional.chain(deleteIntent, api.close) }]} />}
          />

          {intent ? (
            <>
              <Modal.Body gap={16}>
                <CMSFormName
                  value={intent.name}
                  error={editIntentValidator.nameError}
                  disabled={isBuiltIn}
                  autoFocus={!newUtterances?.length}
                  placeholder="Enter intent name"
                  onValueChange={onNameChange}
                />

                <CMSFormDescription
                  value={intent.description ?? ''}
                  error={editIntentValidator.descriptionError}
                  minRows={1}
                  maxRows={17}
                  placeholder="Enter intent description"
                  onValueChange={onDescriptionChange}
                />
              </Modal.Body>

              <Divider noPadding />

              <IntentEditForm
                intent={intent}
                newUtterances={newUtterances}
                utterancesError={editIntentValidator.utterancesError}
                resetUtterancesError={editIntentValidator.resetUtterancesError}
              />
            </>
          ) : (
            <Modal.Body>Intent not found</Modal.Body>
          )}

          <Modal.Footer>
            <Modal.Footer.Button label="Close" variant="secondary" onClick={api.close} disabled={closePrevented} />
          </Modal.Footer>
        </Modal.Container>
      );
    }
);
