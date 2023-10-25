import { UtteranceText } from '@voiceflow/sdk-logux-designer';
import { Divider, SquareButton } from '@voiceflow/ui-next';
import React from 'react';

import { CMSFormName } from '@/components/CMS/CMSForm/CMSFormName/CMSFormName.component';
import { IntentEditForm } from '@/components/Intent/IntentEditForm/IntentEditForm.component';
import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';

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
      const patchIntent = useDispatch(Designer.Intent.effect.patchOne, intentID);

      return (
        <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} onEscClose={api.close}>
          <Modal.Header
            title="Edit intent"
            onClose={api.close}
            leftButton={<SquareButton iconName="Menu" />}
            secondaryButton={<SquareButton iconName="More" />}
          />

          {!!intent && (
            <>
              <CMSFormName pb={24} value={intent.name} placeholder="Enter intent name" onValueChange={(name) => name && patchIntent({ name })} />

              <Divider />

              <IntentEditForm intentID={intentID} newUtterances={newUtterances} />
            </>
          )}

          <Modal.Footer>
            <Modal.Footer.Button label="Close" variant="secondary" onClick={api.close} disabled={closePrevented} />
          </Modal.Footer>
        </Modal>
      );
    }
);
