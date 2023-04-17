import { Modal, toast } from '@voiceflow/ui';
import React from 'react';

import * as CustomBlock from '@/ducks/customBlock';
import { useDispatch, useSelector } from '@/hooks';

import manager from '../../../../manager';
import ModalContent, { SubmittedCustomBlock } from '../CustomBlockEditorModalContent';

export interface CustomBlocksCreateModalProps {
  blockID: string;
}

const CustomBlockEditModal = manager.create<CustomBlocksCreateModalProps>(
  'CanvasCustomBlockEditModal',
  () =>
    ({ api, type, opened, hidden, animated, blockID }) => {
      const updateCustomBlock = useDispatch(CustomBlock.update);
      const customBlock = useSelector(CustomBlock.customBlockByIDSelector, { id: blockID });

      if (!customBlock) {
        throw new Error('Custom Block Edit Modal failed because the custom block does not exist.');
      }

      const onReceiveFormData = async (customBlock: SubmittedCustomBlock) => {
        try {
          await updateCustomBlock({ id: blockID!, ...customBlock });
          api.close();
          toast.success('Custom block updated in all instances');
        } catch (err) {
          toast.error('Custom block edit failed');
        }
      };

      return (
        <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={450} hideScrollbar>
          <ModalContent
            currentFormVal={customBlock}
            title="Edit Custom Block"
            confirmText="Save Changes"
            onCancel={api.close}
            onSubmit={onReceiveFormData}
            style={{ confirmButton: { width: '142px' } }}
            detectDuplicateNames={false}
          />
        </Modal>
      );
    }
);

export default CustomBlockEditModal;
