import { Box, Label, Text, Upload, UploadIconVariant } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import TextInput from '@/components/Form/TextInput';
import * as ProjectV2 from '@/ducks/projectV2';
import * as VersionV2 from '@/ducks/versionV2';
import { useBoundValue, useDispatch } from '@/hooks';
import { withTargetValue } from '@/utils/dom';

import { useValidator } from '../hooks';

const largeIconSelector = createSelector([VersionV2.active.alexa.publishingSelector], (publishing) => publishing?.largeIcon);
const smallIconSelector = createSelector([VersionV2.active.alexa.publishingSelector], (publishing) => publishing?.smallIcon);

const BasicSkillInfoForm: React.FC = () => {
  const [projectNameError, projectNameValidator] = useValidator('name', (name: string) => (name ? false : 'Display name is required.'));
  const [projectName, setProjectName, saveProjectName] = useBoundValue(
    ProjectV2.active.nameSelector,
    projectNameValidator(ProjectV2.updateActiveProjectName)
  );

  const largeIcon = useSelector(largeIconSelector);
  const saveLargeIcon = useDispatch((largeIcon: string | null) => VersionV2.alexa.patchPublishing({ largeIcon: largeIcon ?? '' }));

  const smallIcon = useSelector(smallIconSelector);
  const saveSmallIcon = useDispatch((smallIcon: string | null) => VersionV2.alexa.patchPublishing({ smallIcon: smallIcon ?? '' }));

  return (
    <>
      <Box mb={24}>
        <Label>Display Name</Label>
        <TextInput
          name="name"
          type="text"
          placeholder="Storyflow - Interactive Story Adventures"
          value={projectName}
          onChange={withTargetValue(setProjectName)}
          onBlur={saveProjectName}
          touched={!!projectNameError}
          error={projectNameError}
        />
      </Box>

      <Box.Flex mb={8}>
        <Box width="50%">
          <Label textAlign="center">Large Icon</Label>
          <Box.FlexCenter>
            <Upload.IconUpload
              size={UploadIconVariant.EXTRA_LARGE}
              canRemove
              endpoint="/image/large_icon"
              image={largeIcon ?? ''}
              update={saveLargeIcon}
            />
          </Box.FlexCenter>
        </Box>
        <Box width="50%">
          <Label textAlign="center">Small Icon</Label>
          <Box.FlexCenter>
            <Upload.IconUpload size={UploadIconVariant.LARGE} canRemove endpoint="/image/small_icon" image={smallIcon ?? ''} update={saveSmallIcon} />
          </Box.FlexCenter>
        </Box>
      </Box.Flex>
    </>
  );
};

export default BasicSkillInfoForm;

export const BasicSkillInfoDescription: React.FC = () => (
  <>
    <Box mb={16}>
      <Text color="#8da2b5" fontSize={13}>
        <b>Display Name</b> is what we display for your Skill on Voiceflow/Amazon
      </Text>
    </Box>
    <Box mb={16}>
      <Text color="#8da2b5" fontSize={13}>
        <b>Icons</b> are what will be displayed for your Skill in the Amazon web store.
      </Text>
    </Box>
  </>
);
