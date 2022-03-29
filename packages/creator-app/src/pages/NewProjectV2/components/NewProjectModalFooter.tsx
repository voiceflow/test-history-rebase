import { BoxFlexAlignEnd, BoxFlexApart, Button, ButtonVariant, Link } from '@voiceflow/ui';
import React from 'react';

import { ModalFooter } from '@/components/Modal';
import * as Documentation from '@/config/documentation';

interface NewProjectModalFooterProps {
  onCreate: () => void;
  onCancel: () => void;
  isCreateLoading: boolean;
}

const NewProjectModalFooter: React.FC<NewProjectModalFooterProps> = ({ onCreate, onCancel, isCreateLoading }) => {
  return (
    <ModalFooter>
      <BoxFlexApart fullWidth>
        <Link href={Documentation.PROJECT_CREATE}>Learn more</Link>
        <BoxFlexAlignEnd>
          <Button onClick={onCancel} variant={ButtonVariant.TERTIARY} squareRadius style={{ marginRight: '10px', display: 'inline-block' }}>
            Cancel
          </Button>
          <Button disabled={isCreateLoading} onClick={onCreate} style={{ display: 'inline-block' }} variant={ButtonVariant.PRIMARY} squareRadius>
            Create
          </Button>
        </BoxFlexAlignEnd>
      </BoxFlexApart>
    </ModalFooter>
  );
};

export default NewProjectModalFooter;
