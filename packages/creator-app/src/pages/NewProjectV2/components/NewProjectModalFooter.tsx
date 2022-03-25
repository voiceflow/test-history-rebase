import { Box, Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { ModalFooter } from '@/components/Modal';

interface NewProjectModalFooterProps {
  onCreate: () => void;
  onCancel: () => void;
}

const NewProjectModalFooter: React.FC<NewProjectModalFooterProps> = ({ onCreate, onCancel }) => {
  return (
    <ModalFooter justifyContent="flex-end">
      <Box>
        <Button onClick={onCancel} variant={ButtonVariant.TERTIARY} squareRadius style={{ marginRight: '10px', display: 'inline-block' }}>
          Cancel
        </Button>
        <Button onClick={onCreate} style={{ display: 'inline-block' }} variant={ButtonVariant.PRIMARY} squareRadius>
          Create
        </Button>
      </Box>
    </ModalFooter>
  );
};

export default NewProjectModalFooter;
