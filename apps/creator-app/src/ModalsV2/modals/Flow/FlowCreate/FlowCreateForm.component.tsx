import { tid } from '@voiceflow/style';
import { Box, Scroll } from '@voiceflow/ui-next';
import React from 'react';

import { CMSFormDescription } from '@/components/CMS/CMSForm/CMSFormDescription/CMSFormDescription.component';
import { CMSFormName } from '@/components/CMS/CMSForm/CMSFormName/CMSFormName.component';
import { Modal } from '@/components/Modal';

export interface IFlowCreateForm {
  name: string;
  testID: string;
  disabled: boolean;
  nameError: string | null;
  description: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
}

export const FlowCreateForm: React.FC<IFlowCreateForm> = ({ name, testID, disabled, nameError, description, onNameChange, onDescriptionChange }) => {
  return (
    <Scroll style={{ display: 'block' }}>
      <Modal.Body gap={16}>
        <CMSFormName
          value={name}
          error={nameError}
          testID={tid(testID, 'name')}
          disabled={disabled}
          autoFocus
          placeholder="Enter component name"
          onValueChange={onNameChange}
        />

        <Box direction="column">
          <CMSFormDescription
            value={description}
            testID={tid(testID, 'description')}
            maxRows={25}
            disabled={disabled}
            placeholder="Enter description (optional)"
            onValueChange={onDescriptionChange}
          />
        </Box>
      </Modal.Body>
    </Scroll>
  );
};
