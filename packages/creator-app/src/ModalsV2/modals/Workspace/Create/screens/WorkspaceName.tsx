import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, ErrorMessage, Input, Modal, Upload, UploadIconVariant } from '@voiceflow/ui';
import React from 'react';

import * as Feature from '@/ducks/feature';
import * as Workspace from '@/ducks/workspace';
import { useDispatch, useSelector } from '@/hooks';
import * as Sentry from '@/vendors/sentry';

interface WorkspaceNameProps {
  workspaceName: string;
  workspaceImage: string | null;
  onCreateWorkspace: VoidFunction;
  onChangeName: React.Dispatch<React.SetStateAction<string>>;
  onChangeImage: React.Dispatch<React.SetStateAction<string | null>>;
  onClose: VoidFunction;
  creating?: boolean;
}

const WorkspaceName: React.FC<WorkspaceNameProps> = ({
  workspaceName,
  workspaceImage,
  onCreateWorkspace,
  onChangeName,
  onChangeImage,
  onClose,
  creating,
}) => {
  const [nameError, setNameError] = React.useState<string | null>(null);

  const canContinue = !!workspaceName.trim() && workspaceName.length <= 32;

  const isIdentityWorkspaceEnabled = useSelector(Feature.isFeatureEnabledSelector)(Realtime.FeatureFlag.IDENTITY_WORKSPACE);
  const updateActiveWorkspaceImage = useDispatch(Workspace.updateActiveWorkspaceImage);

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
              autoFocus
              value={workspaceName}
              placeholder="Enter workspace name"
              onChangeText={onChangeName}
              onBlur={onBlur}
              error={!!nameError}
            />
            {nameError && <ErrorMessage mb={0}>{nameError}</ErrorMessage>}
          </Box>
          {isIdentityWorkspaceEnabled ? (
            <Upload.Provider client={{ upload: (_endpoint, _fileType, formData) => updateActiveWorkspaceImage(formData) }} onError={Sentry.error}>
              <Upload.IconUpload image={workspaceImage} update={onChangeImage} size={UploadIconVariant.EXTRA_SMALL} isSquare />
            </Upload.Provider>
          ) : (
            <Upload.IconUpload image={workspaceImage} update={onChangeImage} size={UploadIconVariant.EXTRA_SMALL} isSquare />
          )}
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
