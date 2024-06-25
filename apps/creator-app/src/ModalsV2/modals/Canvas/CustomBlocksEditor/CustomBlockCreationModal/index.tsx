import { Modal, toast } from '@voiceflow/ui';
import React from 'react';

import * as CustomBlock from '@/ducks/customBlock';
import { useDispatch, useTrackingEvents } from '@/hooks';

import manager from '../../../../manager';
import type { SubmittedCustomBlock } from '../CustomBlockEditorModalContent';
import ModalContent from '../CustomBlockEditorModalContent';

// eslint-disable-next-line @typescript-eslint/ban-types
const CustomBlockCreationModal = manager.create<{}>(
  'CanvasCustomBlockCreationModal',
  () =>
    ({ api, type, opened, hidden, animated }) => {
      const createCustomBlock = useDispatch(CustomBlock.create);

      const [trackingEvents] = useTrackingEvents();

      const onReceiveFormData = async (customBlock: SubmittedCustomBlock) => {
        try {
          await createCustomBlock(customBlock);
          api.close();
          toast.success('Custom block created');

          trackingEvents.trackNewCustomBlockCreated();
        } catch (err) {
          toast.error('Custom block creation failed');
        }
      };

      return (
        <Modal
          type={type}
          opened={opened}
          hidden={hidden}
          animated={animated}
          onExited={api.remove}
          maxWidth={450}
          hideScrollbar
        >
          <ModalContent
            title="Add Custom Block"
            confirmText="Add Custom Block"
            onCancel={api.onClose}
            onSubmit={onReceiveFormData}
            style={{ confirmButton: { width: '175px' } }}
            detectDuplicateNames={true}
          />
        </Modal>
      );
    }
);

export default CustomBlockCreationModal;
