import { Box, BoxFlex, Input, Label, Toggle } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import * as Account from '@/ducks/account';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Version from '@/ducks/version';
import { useBoundValue, useDispatch } from '@/hooks';
import { getTargetValue } from '@/utils/dom';

import { DEFAULT_TERM_ENDPOINT, generateTerms } from '../utils';

const generatedTermsSelector = createSelector(
  [Version.alexa.activePublishingSelector, Account.userSelector, ProjectV2.active.nameSelector],
  (publishing, user, projectName) => generateTerms(user.name!, projectName!, publishing?.forChildren)
);
const privacyPolicySelector = createSelector([Version.alexa.activePublishingSelector], (publishing) => publishing?.privacyPolicy);
const termsAndConditionsSelector = createSelector([Version.alexa.activePublishingSelector], (publishing) => publishing?.termsAndConditions);
const forChildrenSelector = createSelector([Version.alexa.activePublishingSelector], (publishing) => !!publishing?.forChildren);

const PrivacyTermsForm: React.FC = () => {
  const generatedTerms = useSelector(generatedTermsSelector);
  const [privacyPolicy, setPrivacyPolicy, savePrivacyPolicy] = useBoundValue(privacyPolicySelector, (privacyPolicy) =>
    Version.alexa.savePublishing({ privacyPolicy })
  );

  const [termsAndConditions, setTermsAndConditions, saveTermsAndConditions] = useBoundValue(termsAndConditionsSelector, (termsAndConditions) =>
    Version.alexa.savePublishing({ termsAndConditions })
  );

  const forChildren = useSelector(forChildrenSelector);
  const saveForChildren = useDispatch((forChildren: boolean) => Version.alexa.savePublishing({ forChildren }));

  React.useEffect(() => {
    if (!termsAndConditions || termsAndConditions.startsWith(DEFAULT_TERM_ENDPOINT)) {
      setTermsAndConditions(generatedTerms);
    }
    if (!privacyPolicy || privacyPolicy.startsWith(DEFAULT_TERM_ENDPOINT)) {
      setPrivacyPolicy(generatedTerms);
    }
  }, [forChildren]);

  return (
    <>
      <Box mb={24}>
        <Label>Privacy Policy URL</Label>
        <Input
          className="form-bg"
          name="privacyPolicy"
          type="text"
          placeholder="Privacy Policy"
          value={privacyPolicy}
          onChange={getTargetValue(setPrivacyPolicy)}
          onBlur={savePrivacyPolicy}
        />
      </Box>

      <Box mb={24}>
        <Box mb={24}>
          <Label>Terms and Conditions URL</Label>
          <Input
            className="form-bg"
            type="text"
            name="termsAndConditions"
            placeholder="Terms and Conditions"
            value={termsAndConditions}
            onChange={getTargetValue(setTermsAndConditions)}
            onBlur={saveTermsAndConditions}
          />
        </Box>

        <Label>Is this skill directed to children under the age of 13?</Label>
        <BoxFlex>
          <u className="mr-2">{forChildren ? 'YES' : 'NO'}</u>
          <Toggle name="copa" checked={forChildren} onChange={() => saveForChildren(!forChildren)} />
        </BoxFlex>
      </Box>
    </>
  );
};

export default PrivacyTermsForm;

export const PrivacyTermsDescription: React.FC = () => (
  <>
    <div className="publish-info">
      <p className="helper-text">
        The <b>privacy policy url</b> is a link to the privacy policy your users will agree to when using your Skill.
      </p>
    </div>
    <div className="publish-info">
      <p className="helper-text">
        The <b>terms and conditions url</b> is a link to the terms and conditions your users will agree to when using your Skill.
      </p>
    </div>
    <div className="publish-info">
      <p className="helper-text">
        Please indicate if this skill is directed to children under the age of 13 (for the United States, as determined under the&nbsp;
        <a href="https://www.ftc.gov/tips-advice/business-center/privacy-and-security/children%27s-privacy" target="_blank" rel="noopener noreferrer">
          Children's Online Privacy Protection Act (COPPA)
        </a>
        )
      </p>
    </div>
  </>
);
