import React from 'react';
import { useSelector } from 'react-redux';
// import Select from 'react-select';
import { FormGroup, Label } from 'reactstrap';
import { createSelector } from 'reselect';

import TextBox from '@/components/Form/TextBox';
import TextInput from '@/components/Form/TextInput';
import Select from '@/components/Select';
import * as Project from '@/ducks/project';
import * as Version from '@/ducks/version';
import { useBoundValue, useDispatch } from '@/hooks';
import { AMAZON_CATEGORIES } from '@/services/Categories';
import { getTargetValue } from '@/utils/dom';

import { useValidator } from '../hooks';

const updatesDescriptionSelector = createSelector([Version.alexa.activePublishingSelector], (publishing) => publishing?.updatesDescription);
const categorySelector = createSelector([Version.alexa.activePublishingSelector], (publishing) => publishing?.category);
const keywordsSelector = createSelector([Version.alexa.activePublishingSelector], (publishing) => publishing?.keywords);
const summarySelector = createSelector([Version.alexa.activePublishingSelector], (publishing) => publishing?.summary);
const descriptionSelector = createSelector([Version.alexa.activePublishingSelector], (publishing) => publishing?.description);

const SkillDescriptionForm: React.FC = () => {
  const isLive = useSelector(Project.isActiveProjectLiveSelector);

  const category = useSelector(categorySelector);
  const saveCategory = useDispatch((category: string) => Version.alexa.savePublishing({ category }));

  const [updatesDescription, setUpdatesDescription, saveUpdatesDescription] = useBoundValue(updatesDescriptionSelector, (updatesDescription) =>
    Version.alexa.savePublishing({ updatesDescription })
  );

  const [summaryError, summaryValidator] = useValidator('summary', (name: string) => (name ? false : 'Display Summary is required.'));
  const [summary, setSummary, saveSummary] = useBoundValue(
    summarySelector,
    summaryValidator((summary) => Version.alexa.savePublishing({ summary }))
  );

  const [descriptionError, descriptionValidator] = useValidator('description', (name: string) => (name ? false : 'Display description is required.'));
  const [description, setDescription, saveDescription] = useBoundValue(
    descriptionSelector,
    descriptionValidator((description) => Version.alexa.savePublishing({ description }))
  );

  const [keywords, setKeywords, saveKeywords] = useBoundValue(keywordsSelector, (keywords) => Version.alexa.savePublishing({ keywords }));

  return (
    <>
      <FormGroup className="mt-0 mb-4">
        <Label className="publish-label">Summary</Label>
        <TextInput
          type="text"
          name="summary"
          placeholder="One Sentence Skill Summary"
          value={summary}
          onChange={getTargetValue(setSummary)}
          onBlur={saveSummary}
          touched={!!summaryError}
          error={summaryError}
        />
      </FormGroup>

      <FormGroup className="mb-4">
        <Label className="publish-label">Description</Label>
        <TextBox
          name="description"
          minRows={4}
          maxRows={4}
          placeholder="Skill Description"
          style={{ minHeight: '94px', maxHeight: '94px' }}
          value={description}
          onChange={getTargetValue(setDescription)}
          onBlur={saveDescription}
          touched={!!descriptionError}
          error={descriptionError}
        />
      </FormGroup>

      {isLive && (
        <FormGroup className="mb-4">
          <Label className="publish-label">
            What's new? <small>optional</small>
          </Label>
          <TextBox
            name="updatesDescription"
            minRows={4}
            maxRows={4}
            placeholder="What's new?"
            style={{ minHeight: '94px', maxHeight: '94px' }}
            value={updatesDescription}
            onChange={getTargetValue(setUpdatesDescription)}
            onBlur={saveUpdatesDescription}
          />
        </FormGroup>
      )}

      <FormGroup className="mb-4">
        <Label className="publish-label">Category</Label>
        <Select
          value={AMAZON_CATEGORIES.find((option) => option.value === category || option.label === category)?.value}
          options={AMAZON_CATEGORIES}
          onSelect={(value) => saveCategory(value)}
          searchable
          placeholder="Select..."
          getOptionValue={(option) => option?.value}
          getOptionLabel={(value) => AMAZON_CATEGORIES.find((option) => option.value === value || option.label === value)?.label}
        />
      </FormGroup>

      <FormGroup className="mb-4">
        <Label className="publish-label">
          Keywords <small>Seperated by commas</small>
        </Label>
        <TextInput
          type="text"
          name="keywords"
          placeholder="e.g. Game, Quiz, Space..."
          value={keywords}
          onChange={getTargetValue(setKeywords)}
          onBlur={saveKeywords}
        />
      </FormGroup>
    </>
  );
};

export default SkillDescriptionForm;

export const SkillDescriptionDescription: React.FC = () => {
  const isLive = useSelector(Project.isActiveProjectLiveSelector);

  return (
    <>
      <div className="publish-info">
        <p className="helper-text">
          <b>Summary</b> is a one sentence description of your amazing Skill.
        </p>
      </div>
      <div className="publish-info">
        <p className="helper-text">
          <b>Description</b> is where you can provide a more detailed explanation of your Skill.
        </p>
      </div>
      {isLive && (
        <div className="publish-info">
          <p className="helper-text"></p>
        </div>
      )}
      <div className="publish-info">
        <p className="helper-text">
          <b>Category</b> is the type of your Skill.This helps users find your Skill in the store.
        </p>
      </div>
      <div className="publish-info">
        <p className="helper-text">
          <b>Keywords</b> are words that will help your Skill be found when users are searching the Skill store.
        </p>
      </div>
    </>
  );
};
