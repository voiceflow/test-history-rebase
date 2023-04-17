import { Box, BoxFlex, BoxFlexCenter, Label, Upload, UploadIconVariant } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import TextInput from '@/components/Form/TextInput';
import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Version from '@/ducks/version';
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
    projectNameValidator(Project.updateActiveProjectName)
  );

  const largeIcon = useSelector(largeIconSelector);
  const saveLargeIcon = useDispatch((largeIcon: string | null) => Version.alexa.patchPublishing({ largeIcon: largeIcon ?? '' }));

  const smallIcon = useSelector(smallIconSelector);
  const saveSmallIcon = useDispatch((smallIcon: string | null) => Version.alexa.patchPublishing({ smallIcon: smallIcon ?? '' }));

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

      <BoxFlex mb={8}>
        <Box width="50%">
          <Label textAlign="center">Large Icon</Label>
          <BoxFlexCenter>
            <Upload.IconUpload
              size={UploadIconVariant.EXTRA_LARGE}
              canRemove
              endpoint="/image/large_icon"
              image={largeIcon ?? ''}
              update={saveLargeIcon}
            />
          </BoxFlexCenter>
        </Box>
        <Box width="50%">
          <Label textAlign="center">Small Icon</Label>
          <BoxFlexCenter>
            <Upload.IconUpload size={UploadIconVariant.LARGE} canRemove endpoint="/image/small_icon" image={smallIcon ?? ''} update={saveSmallIcon} />
          </BoxFlexCenter>
        </Box>
      </BoxFlex>
    </>
  );
};

export default BasicSkillInfoForm;

export const BasicSkillInfoDescription: React.FC = () => (
  <>
    <div className="publish-info">
      <p className="helper-text">
        <b>Display Name</b> is what we display for your Skill on Voiceflow/Amazon
      </p>
    </div>
    <div className="publish-info">
      <p className="helper-text">
        <b>Icons</b> are what will be displayed for your Skill in the Amazon web store.
      </p>
    </div>
  </>
);
