import { Box, Checkbox, Label, Text } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import TextBox from '@/components/Form/TextBox';
import RadioGroup from '@/components/RadioGroup';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useBoundValue, useDispatch } from '@/hooks';
import { withTargetValue } from '@/utils/dom';

import { useValidator } from '../hooks';

const hasPurchaseSelector = createSelector([VersionV2.active.alexa.publishingSelector], (publishing) => !!publishing?.hasPurchase);
const collectsPersonalInfoSelector = createSelector([VersionV2.active.alexa.publishingSelector], (publishing) => !!publishing?.personal);
const hasAdsSelector = createSelector([VersionV2.active.alexa.publishingSelector], (publishing) => !!publishing?.hasAds);
const instructionsSelector = createSelector([VersionV2.active.alexa.publishingSelector], (publishing) => publishing?.instructions ?? '');
const forExportSelector = createSelector([VersionV2.active.alexa.publishingSelector], (publishing) => !!publishing?.forExport);

const PrivacyComplianceForm: React.FC = () => {
  const hasPurchase = useSelector(hasPurchaseSelector);
  const saveHasPurchase = useDispatch((hasPurchase: boolean) => Version.alexa.patchPublishing({ hasPurchase }));

  const forExport = useSelector(forExportSelector);
  const saveForExport = useDispatch((forExport: boolean) => Version.alexa.patchPublishing({ forExport }));

  const collectsPersonalInfo = useSelector(collectsPersonalInfoSelector);
  const saveCollectsPersonalInfo = useDispatch((personal: boolean) => Version.alexa.patchPublishing({ personal }));

  const hasAds = useSelector(hasAdsSelector);
  const saveHasAds = useDispatch((hasAds: boolean) => Version.alexa.patchPublishing({ hasAds }));

  const [instructionsError, instructionsValidator] = useValidator('instructions', (instructions: string) =>
    instructions ? false : 'Testing instructions are required.'
  );
  const [instructions, setInstructions, saveInstructions] = useBoundValue(
    instructionsSelector,
    instructionsValidator((instructions: string) => Version.alexa.patchPublishing({ instructions }))
  );

  return (
    <Box className="form" maxWidth="627px" display="block">
      <Box mb={12}>
        <label>Does this skill allow users to make purchases or spend real money?</label>
        <RadioGroup name="purchase" checked={hasPurchase} onChange={saveHasPurchase} />
      </Box>

      <Box mb={12}>
        <label>Does this Alexa skill collect users' personal information?</label>
        <RadioGroup name="personal" checked={collectsPersonalInfo} onChange={saveCollectsPersonalInfo} />
      </Box>

      <Box mb={12}>
        <label>Does this skill contain advertising?</label>
        <RadioGroup name="ads" checked={hasAds} onChange={saveHasAds} />
      </Box>

      <Box mb={12}>
        <label>Export Compliance</label>
        <Box mb={10} color="#62778c">
          This Alexa skill may be imported to and exported from the United States and all other countries and regions in which Amazon operates thei
          program or in which you've authorized sales to end users (without the need for us to obtain any license or clearance or take any other acti
          and is in full compliance with all applicable laws and regulations governing imports and exports, including those applicable to software
          that makes use of encryption technology.
        </Box>

        <Checkbox name="export" checked={forExport} onChange={() => saveForExport(!forExport)}>
          <div>I Certify</div>
        </Checkbox>
      </Box>
      <div className="">
        <Label>Testing Instructions</Label>
        <TextBox
          name="instructions"
          minRows={3}
          maxRows={3}
          placeholder="Any Particular Testing Instructions for Amazon Approval Process"
          style={{ height: 94 }}
          value={instructions}
          onChange={withTargetValue(setInstructions)}
          onBlur={saveInstructions}
          touched={!!instructionsError}
          error={instructionsError}
        />
      </div>
    </Box>
  );
};

export default PrivacyComplianceForm;

export const PrivacyComplianceDescription: React.FC = () => (
  <>
    <Box mb={16}>
      <Text color="#8da2b5" fontSize={13}>
        Personal Information includes anything that can identify the user such as name, email, password, phone number, birth date, etc.
      </Text>
    </Box>
    <Box mb={16}>
      <Text color="#8da2b5" fontSize={13}>
        Indicate if this skill is directed to children under the age of 13, as determined under the Children's Online Privacy Protection Act (COPPA).
      </Text>
    </Box>
    <Box mb={16}>
      <Text color="#8da2b5" fontSize={13}>
        Please detail any special instructions our team will need in order to test your skill. Include any account or hardware requirements. If your
        skill requests permissions, include ways to test these permissions requests. This information is not displayed to customers.
      </Text>
    </Box>
  </>
);
