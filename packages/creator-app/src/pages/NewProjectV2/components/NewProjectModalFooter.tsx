import { BoxFlexAlignEnd, Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { ModalFooter } from '@/components/Modal';

interface NewProjectModalFooterProps {
  onCreate: () => void;
  onCancel: () => void;
  isCreateLoading: boolean;
}

const NewProjectModalFooter: React.FC<NewProjectModalFooterProps> = ({ onCreate, onCancel, isCreateLoading }) => {
  return (
    <ModalFooter>
      <BoxFlexAlignEnd>
        <Button onClick={onCancel} variant={ButtonVariant.TERTIARY} squareRadius style={{ marginRight: '10px', display: 'inline-block' }}>
          Cancel
        </Button>
        <Button disabled={isCreateLoading} onClick={onCreate} style={{ display: 'inline-block' }} variant={ButtonVariant.PRIMARY} squareRadius>
          Create
        </Button>
      </BoxFlexAlignEnd>
    </ModalFooter>
  );
};

export default NewProjectModalFooter;
