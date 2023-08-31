import { Box, Label, Select, Text } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import TextBox from '@/components/Form/TextBox';
import TextInput from '@/components/Form/TextInput';
import * as ProjectV2 from '@/ducks/projectV2';
import * as VersionV2 from '@/ducks/versionV2';
import { useBoundValue, useDispatch } from '@/hooks';
import { AMAZON_CATEGORIES } from '@/services/Categories';
import { withTargetValue } from '@/utils/dom';

import { useValidator } from '../hooks';

const updatesDescriptionSelector = createSelector([VersionV2.active.alexa.publishingSelector], (publishing) => publishing?.updatesDescription);
const categorySelector = createSelector([VersionV2.active.alexa.publishingSelector], (publishing) => publishing?.category);
const keywordsSelector = createSelector([VersionV2.active.alexa.publishingSelector], (publishing) => publishing?.keywords);
const summarySelector = createSelector([VersionV2.active.alexa.publishingSelector], (publishing) => publishing?.summary);
const descriptionSelector = createSelector([VersionV2.active.alexa.publishingSelector], (publishing) => publishing?.description);

const SkillDescriptionForm: React.FC = () => {
  const isLive = useSelector(ProjectV2.active.isLiveSelector);

  const category = useSelector(categorySelector);
  const saveCategory = useDispatch((category: string) => VersionV2.alexa.patchPublishing({ category }));

  const [updatesDescription, setUpdatesDescription, saveUpdatesDescription] = useBoundValue(updatesDescriptionSelector, (updatesDescription) =>
    VersionV2.alexa.patchPublishing({ updatesDescription })
  );

  const [summaryError, summaryValidator] = useValidator('summary', (name: string) => (name ? false : 'Display Summary is required.'));
  const [summary, setSummary, saveSummary] = useBoundValue(
    summarySelector,
    summaryValidator((summary) => VersionV2.alexa.patchPublishing({ summary }))
  );

  const [descriptionError, descriptionValidator] = useValidator('description', (name: string) => (name ? false : 'Display description is required.'));
  const [description, setDescription, saveDescription] = useBoundValue(
    descriptionSelector,
    descriptionValidator((description) => VersionV2.alexa.patchPublishing({ description }))
  );

  const [keywords, setKeywords, saveKeywords] = useBoundValue(keywordsSelector, (keywords) => VersionV2.alexa.patchPublishing({ keywords }));

  return (
    <>
      <Box mb={24}>
        <Label>Summary</Label>
        <TextInput
          type="text"
          name="summary"
          placeholder="One Sentence Skill Summary"
          value={summary}
          onChange={withTargetValue(setSummary)}
          onBlur={saveSummary}
          touched={!!summaryError}
          error={summaryError}
        />
      </Box>

      <Box mb={24}>
        <Label>Description</Label>
        <TextBox
          name="description"
          minRows={4}
          maxRows={4}
          placeholder="Skill Description"
          style={{ height: 94 }}
          value={description}
          onChange={withTargetValue(setDescription)}
          onBlur={saveDescription}
          touched={!!descriptionError}
          error={descriptionError}
        />
      </Box>

      {isLive && (
        <Box mb={24}>
          <Label>
            What's new? <small>optional</small>
          </Label>
          <TextBox
            name="updatesDescription"
            minRows={4}
            maxRows={4}
            placeholder="What's new?"
            style={{ height: 94 }}
            value={updatesDescription}
            onChange={withTargetValue(setUpdatesDescription)}
            onBlur={saveUpdatesDescription}
          />
        </Box>
      )}

      <Box mb={24}>
        <Label>Category</Label>
        <Select
          value={AMAZON_CATEGORIES.find((option) => option.value === category || option.label === category)?.value}
          options={AMAZON_CATEGORIES}
          onSelect={(value) => saveCategory(value)}
          searchable
          placeholder="Select..."
          getOptionKey={(option) => option.value}
          getOptionValue={(option) => option?.value}
          getOptionLabel={(value) => AMAZON_CATEGORIES.find((option) => option.value === value || option.label === value)?.label}
        />
      </Box>

      <Box mb={24}>
        <Label>
          Keywords <small>Seperated by commas</small>
        </Label>
        <TextInput
          type="text"
          name="keywords"
          placeholder="e.g. Game, Quiz, Space..."
          value={keywords}
          onChange={withTargetValue(setKeywords)}
          onBlur={saveKeywords}
        />
      </Box>
    </>
  );
};

export default SkillDescriptionForm;

export const SkillDescriptionDescription: React.FC = () => {
  const isLive = useSelector(ProjectV2.active.isLiveSelector);

  return (
    <>
      <Box mb={16}>
        <Text color="#8da2b5" fontSize={13}>
          <b>Summary</b> is a one sentence description of your amazing Skill.
        </Text>
      </Box>
      <Box mb={16}>
        <Text color="#8da2b5" fontSize={13}>
          <b>Description</b> is where you can provide a more detailed explanation of your Skill.
        </Text>
      </Box>
      {isLive && (
        <Box mb={16}>
          <Text color="#8da2b5" fontSize={13}></Text>
        </Box>
      )}
      <Box mb={16}>
        <Text color="#8da2b5" fontSize={13}>
          <b>Category</b> is the type of your Skill.This helps users find your Skill in the store.
        </Text>
      </Box>
      <Box mb={16}>
        <Text color="#8da2b5" fontSize={13}>
          <b>Keywords</b> are words that will help your Skill be found when users are searching the Skill store.
        </Text>
      </Box>
    </>
  );
};
