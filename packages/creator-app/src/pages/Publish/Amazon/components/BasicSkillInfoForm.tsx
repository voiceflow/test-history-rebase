import React from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import Box, { Flex, FlexCenter } from '@/components/Box';
import TextInput from '@/components/Form/TextInput';
import { Label } from '@/components/Text';
import { UploadJustIcon } from '@/components/Upload/ImageUpload/IconUpload';
import * as Project from '@/ducks/project';
import * as Version from '@/ducks/version';
import { useBoundValue, useDispatch } from '@/hooks';
import { getTargetValue } from '@/utils/dom';

import { useValidator } from '../hooks';

const UploadJustIconComponent = UploadJustIcon as React.FC<any>;

const largeIconSelector = createSelector([Version.alexa.activePublishingSelector], (publishing) => publishing?.largeIcon);
const smallIconSelector = createSelector([Version.alexa.activePublishingSelector], (publishing) => publishing?.smallIcon);

const BasicSkillInfoForm: React.FC = () => {
  const [projectNameError, projectNameValidator] = useValidator('name', (name: string) => (name ? false : 'Display name is required.'));
  const [projectName, setProjectName, saveProjectName] = useBoundValue(
    Project.activeProjectNameSelector,
    projectNameValidator(Project.saveProjectName)
  );

  const largeIcon = useSelector(largeIconSelector);
  const saveLargeIcon = useDispatch((largeIcon: string) => Version.alexa.savePublishing({ largeIcon }));

  const smallIcon = useSelector(smallIconSelector);
  const saveSmallIcon = useDispatch((smallIcon: string) => Version.alexa.savePublishing({ smallIcon }));

  return (
    <>
      <Box mb={24}>
        <Label>Display Name</Label>
        <TextInput
          name="name"
          type="text"
          placeholder="Storyflow - Interactive Story Adventures"
          value={projectName}
          onChange={getTargetValue(setProjectName)}
          onBlur={saveProjectName}
          touched={!!projectNameError}
          error={projectNameError}
        />
      </Box>

      <Flex mb={8}>
        <Box width="50%">
          <Label textAlign="center">Large Icon</Label>
          <FlexCenter>
            <UploadJustIconComponent name="largeIcon" size="xlarge" canRemove endpoint="/image/large_icon" image={largeIcon} update={saveLargeIcon} />
          </FlexCenter>
        </Box>
        <Box width="50%">
          <Label textAlign="center">Small Icon</Label>
          <FlexCenter>
            <UploadJustIconComponent name="smallIcon" size="large" canRemove endpoint="/image/small_icon" image={smallIcon} update={saveSmallIcon} />
          </FlexCenter>
        </Box>
      </Flex>
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
