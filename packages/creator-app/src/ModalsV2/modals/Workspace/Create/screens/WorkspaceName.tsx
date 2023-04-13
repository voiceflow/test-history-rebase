import { Box, Button, ErrorMessage, Input, Modal, Upload, UploadIconVariant } from '@voiceflow/ui';
import React from 'react';

interface WorkspaceNameProps {
  onClose: VoidFunction;
  creating?: boolean;
  onChangeName: React.Dispatch<React.SetStateAction<string>>;
  onChangeImage: React.Dispatch<React.SetStateAction<string | null>>;
  workspaceName: string;
  workspaceImage: string | null;
  onCreateWorkspace: VoidFunction;
}

const WorkspaceName: React.FC<WorkspaceNameProps> = ({
  onClose,
  creating,
  onChangeName,
  onChangeImage,
  workspaceName,
  workspaceImage,
  onCreateWorkspace,
}) => {
  const [nameError, setNameError] = React.useState<string | null>(null);

  const canContinue = !!workspaceName.trim() && workspaceName.length <= 32;

  const onBlur = () => {
    if (workspaceName.length > 32) {
      setNameError('Workspace name is too long - 32 characters max');
    } else if (workspaceName.length === 0) {
      setNameError('Workspace name is required');
    } else if (nameError) {
      setNameError(null);
    }
  };

  return (
    <>
      <Modal.Body>
        <Box.FlexApart fullWidth gap={12} alignItems="flex-start">
          <Box fullWidth>
            <Input
              value={workspaceName}
              error={!!nameError}
              onBlur={onBlur}
              autoFocus
              placeholder="Enter workspace name"
              onChangeText={onChangeName}
            />
            {nameError && <ErrorMessage mb={0}>{nameError}</ErrorMessage>}
          </Box>

          <Upload.IconUpload image={workspaceImage} update={onChangeImage} size={UploadIconVariant.EXTRA_SMALL} isSquare />
        </Box.FlexApart>
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Button variant={Button.Variant.TERTIARY} onClick={() => onClose()} squareRadius>
          Cancel
        </Button>

        <Button disabled={!workspaceName || !canContinue || creating} onClick={onCreateWorkspace}>
          Create
        </Button>
      </Modal.Footer>
    </>
  );
};

export default WorkspaceName;
