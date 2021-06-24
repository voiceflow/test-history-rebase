import { Label } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import Checkbox from '@/components/Checkbox';
import TextBox from '@/components/Form/TextBox';
import RadioGroup from '@/components/RadioGroup';
import * as Version from '@/ducks/version';
import { useBoundValue, useDispatch } from '@/hooks';
import { getTargetValue } from '@/utils/dom';

import { useValidator } from '../hooks';

const hasPurchaseSelector = createSelector([Version.alexa.activePublishingSelector], (publishing) => !!publishing?.hasPurchase);
const collectsPersonalInfoSelector = createSelector([Version.alexa.activePublishingSelector], (publishing) => !!publishing?.personal);
const hasAdsSelector = createSelector([Version.alexa.activePublishingSelector], (publishing) => !!publishing?.hasAds);
const instructionsSelector = createSelector([Version.alexa.activePublishingSelector], (publishing) => publishing?.instructions ?? '');
const forExportSelector = createSelector([Version.alexa.activePublishingSelector], (publishing) => !!publishing?.forExport);

const PrivacyComplianceForm: React.FC = () => {
  const hasPurchase = useSelector(hasPurchaseSelector);
  const saveHasPurchase = useDispatch((hasPurchase: boolean) => Version.alexa.savePublishing({ hasPurchase }));

  const forExport = useSelector(forExportSelector);
  const saveForExport = useDispatch((forExport: boolean) => Version.alexa.savePublishing({ forExport }));

  const collectsPersonalInfo = useSelector(collectsPersonalInfoSelector);
  const saveCollectsPersonalInfo = useDispatch((personal: boolean) => Version.alexa.savePublishing({ personal }));

  const hasAds = useSelector(hasAdsSelector);
  const saveHasAds = useDispatch((hasAds: boolean) => Version.alexa.savePublishing({ hasAds }));

  const [instructionsError, instructionsValidator] = useValidator('instructions', (instructions: string) =>
    instructions ? false : 'Testing instructions are required.'
  );
  const [instructions, setInstructions, saveInstructions] = useBoundValue(
    instructionsSelector,
    instructionsValidator((instructions: string) => Version.alexa.savePublishing({ instructions }))
  );

  return (
    <div className="form pa__locale-limited">
      <div className="pb-3 pa__form_container">
        <label>Does this skill allow users to make purchases or spend real money?</label>
        <RadioGroup name="purchase" checked={hasPurchase} onChange={saveHasPurchase} />
      </div>
      <div className="pb-3 pa__form_container">
        <label>Does this Alexa skill collect users' personal information?</label>
        <RadioGroup name="personal" checked={collectsPersonalInfo} onChange={saveCollectsPersonalInfo} />
      </div>
      <div className="pb-3 pa__form_container">
        <label>Does this skill contain advertising?</label>
        <RadioGroup name="ads" checked={hasAds} onChange={saveHasAds} />
      </div>
      <div>
        <label>Export Compliance</label>
        <div style={{ color: '#62778c' }}>
          This Alexa skill may be imported to and exported from the United States and all other countries and regions in which Amazon operates thei
          program or in which you've authorized sales to end users (without the need for us to obtain any license or clearance or take any other acti
          and is in full compliance with all applicable laws and regulations governing imports and exports, including those applicable to software
          that makes use of encryption technology.
        </div>
        <div className="pb-3 pa__checkbox_container">
          <Checkbox name="export" checked={forExport} onChange={() => saveForExport(!forExport)}>
            <div>I Certify</div>
          </Checkbox>
        </div>
      </div>
      <div className="">
        <Label>Testing Instructions</Label>
        <TextBox
          name="instructions"
          minRows={3}
          maxRows={3}
          placeholder="Any Particular Testing Instructions for Amazon Approval Process"
          style={{ minHeight: '94px', maxHeight: '94px' }}
          value={instructions}
          onChange={getTargetValue(setInstructions)}
          onBlur={saveInstructions}
          touched={!!instructionsError}
          error={instructionsError}
        />
      </div>
    </div>
  );
};

export default PrivacyComplianceForm;

export const PrivacyComplianceDescription: React.FC = () => (
  <>
    <div className="publish-info">
      <p className="helper-text">
        Personal Information includes anything that can identify the user such as name, email, password, phone number, birth date, etc.
      </p>
    </div>
    <div className="publish-info">
      <p className="helper-text">
        Indicate if this skill is directed to children under the age of 13, as determined under the Children's Online Privacy Protection Act (COPPA).
      </p>
    </div>
    <div className="publish-info">
      <p className="helper-text">
        Please detail any special instructions our team will need in order to test your skill. Include any account or hardware requirements. If your
        skill requests permissions, include ways to test these permissions requests. This information is not displayed to customers.
      </p>
    </div>
  </>
);
