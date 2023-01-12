import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, ErrorMessage, Input, Modal, toast, Upload, UploadIconVariant } from '@voiceflow/ui';
import React from 'react';

import * as Feature from '@/ducks/feature';
import * as Router from '@/ducks/router';
import * as Workspace from '@/ducks/workspace';
import { useDispatch, useSelector } from '@/hooks';
import * as Sentry from '@/vendors/sentry';

interface WorkspaceNameProps {
  onClose: VoidFunction;
  organization: Realtime.Organization | null;
}

const WorkspaceName: React.FC<WorkspaceNameProps> = ({ onClose, organization }) => {
  const [workspaceName, setWorkspaceName] = React.useState('');
  const [nameError, setNameError] = React.useState<string | null>(null);
  const [workspaceImage, setWorkspaceImage] = React.useState<string | null>(null);
  const canContinue = !!workspaceName.trim() && workspaceName.length <= 32;

  const isIdentityWorkspaceEnabled = useSelector(Feature.isFeatureEnabledSelector)(Realtime.FeatureFlag.IDENTITY_WORKSPACE);
  const updateActiveWorkspaceImage = useDispatch(Workspace.updateActiveWorkspaceImage);
  const createWorkspace = useDispatch(Workspace.createWorkspace);
  const setActiveWorkspace = useDispatch(Workspace.setActive);
  const goToDashboard = useDispatch(Router.goToDashboard);
  const goToWorkspace = useDispatch(Router.goToWorkspace);

  const onBlur = () => {
    if (workspaceName.length > 32) {
      setNameError('Workspace name is too long - 32 characters max');
    } else if (workspaceName.length === 0) {
      setNameError('Workspace name is required');
    } else if (nameError) {
      setNameError(null);
    }
  };

  const onCreateWorkspace = async () => {
    try {
      const workspace = await createWorkspace({
        name: workspaceName,
        image: workspaceImage || undefined,
        organizationID: organization?.id || undefined,
      });
      setActiveWorkspace(workspace.id);
      goToWorkspace(workspace.id);
      onClose();
    } catch (e) {
      toast.error('Error creating workspace, please try again later');
      onClose();
      goToDashboard();
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
              onChangeText={setWorkspaceName}
              onBlur={onBlur}
              error={!!nameError}
            />
            {nameError && <ErrorMessage mb={0}>{nameError}</ErrorMessage>}
          </Box>
          {isIdentityWorkspaceEnabled ? (
            <Upload.Provider client={{ upload: (_endpoint, _fileType, formData) => updateActiveWorkspaceImage(formData) }} onError={Sentry.error}>
              <Upload.IconUpload image={workspaceImage} update={setWorkspaceImage} size={UploadIconVariant.EXTRA_SMALL} isSquare />
            </Upload.Provider>
          ) : (
            <Upload.IconUpload image={workspaceImage} update={setWorkspaceImage} size={UploadIconVariant.EXTRA_SMALL} isSquare />
          )}
        </Box.FlexApart>
      </Modal.Body>
      <Modal.Footer gap={12}>
        <Button variant={Button.Variant.TERTIARY} onClick={() => onClose()} squareRadius>
          Cancel
        </Button>

        <Button disabled={!workspaceName || !canContinue} onClick={onCreateWorkspace}>
          Create
        </Button>
      </Modal.Footer>
    </>
  );
};

export default WorkspaceName;
