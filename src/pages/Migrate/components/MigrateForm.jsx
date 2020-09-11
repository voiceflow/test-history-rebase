import React from 'react';
import { Alert } from 'reactstrap';

import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import DropdownButton from '@/components/DropdownButton';
import Input from '@/components/Input';
import Menu, { MenuItem } from '@/components/Menu';
import { FeatureFlag } from '@/config/features';
import * as Account from '@/ducks/account';
import { updateSelectedVendor, updateVendorSkillID } from '@/ducks/account/sideEffectsV2';
import * as AlexaPublish from '@/ducks/publish/alexa';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';

function Migrate({
  amznID,
  amazonAccount,
  projectID,
  updateVendor,
  updateAmznId,
  vendorID,
  onError,
  onSuccess,
  updateSelectedVendor,
  updateVendorSkillID,
}) {
  const [newAmznID, setNewAmznID] = React.useState('');
  const dataRefactor = useFeature(FeatureFlag.DATA_REFACTOR);

  const updateSkillID = async () => {
    try {
      if (dataRefactor.isEnabled) {
        await updateVendorSkillID(projectID, vendorID, newAmznID);
      } else {
        await updateAmznId(projectID, vendorID, newAmznID);
      }

      onSuccess();
    } catch (error) {
      onError(JSON.stringify(error?.response?.data?.data));
    }
  };

  const vendors = amazonAccount?.vendors;
  if (!vendors) {
    return <Alert color="danger">No Amazon Account Linked to Voiceflow</Alert>;
  }

  const disabled = !newAmznID.trim();

  return (
    <>
      <Alert className="mb-3">
        {amznID ? (
          <>
            Current Skill ID: <b>{amznID}</b>
          </>
        ) : (
          'There is no existing Alexa Skill associated with this Voiceflow project, updating will link an existing Skill with this project'
        )}
      </Alert>
      <Alert color="danger">
        Updating the Skill ID will cause Voiceflow to overwrite any existing content on the development version of the Skill on Alexa Developer
        Console
      </Alert>
      <Input className="my-3" value={newAmznID} onChange={(e) => setNewAmznID(e.target.value)} placeholder="New Skill ID" />
      {vendors.length > 1 ? (
        <DropdownButton
          buttonProps={{
            onClick: updateSkillID,
            disabled,
          }}
          dropdownProps={{
            selfDismiss: true,
          }}
          menu={
            <Menu>
              <MenuItem disabled>Select Vendor</MenuItem>
              <MenuItem divider />
              {vendors.map(({ id, name }) => (
                <MenuItem key={id} onClick={() => (dataRefactor.isEnabled ? updateSelectedVendor(id) : updateVendor(id))}>
                  <Checkbox checked={vendorID === id} readOnly /> {name}
                </MenuItem>
              ))}
            </Menu>
          }
        >
          Update Skill ID
        </DropdownButton>
      ) : (
        <Button onClick={updateSkillID} disabled={disabled}>
          Update Skill ID
        </Button>
      )}
    </>
  );
}

const mapStateToProps = {
  amznID: AlexaPublish.amznIDSelector,
  projectID: Skill.activeProjectIDSelector,
  amazonAccount: Account.amazonAccountSelector,
  vendorID: AlexaPublish.vendorIdSelector,
};

const mapDispatchToProps = {
  updateAmznId: Account.updateAmznId,
  updateVendor: AlexaPublish.updateVendor,
  updateVendorSkillID,
  updateSelectedVendor,
};

export default connect(mapStateToProps, mapDispatchToProps)(Migrate);
