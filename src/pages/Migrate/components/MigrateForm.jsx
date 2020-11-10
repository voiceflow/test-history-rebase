import React from 'react';
import { Alert } from 'reactstrap';

import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import DropdownButton from '@/components/DropdownButton';
import Input from '@/components/Input';
import Menu, { MenuItem } from '@/components/Menu';
import * as Account from '@/ducks/account';
import * as AlexaPublish from '@/ducks/publish/alexa';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';

function Migrate({ amazonID, amazonAccount, projectID, vendorID, onError, onSuccess, updateSelectedVendor, updateVendorSkillID }) {
  const [newAmazonID, setNewAmaonID] = React.useState('');

  const updateSkillID = async () => {
    try {
      await updateVendorSkillID(projectID, vendorID, newAmazonID);

      onSuccess();
    } catch (error) {
      onError(JSON.stringify(error?.response?.data?.data));
    }
  };

  const vendors = amazonAccount?.vendors;

  if (!vendors) {
    return <Alert color="danger">No Amazon Account Linked to Voiceflow</Alert>;
  }

  const disabled = !newAmazonID.trim();

  return (
    <>
      <Alert className="mb-3">
        {amazonID ? (
          <>
            Current Skill ID: <b>{amazonID}</b>
          </>
        ) : (
          'There is no existing Alexa Skill associated with this Voiceflow project, updating will link an existing Skill with this project'
        )}
      </Alert>

      <Alert color="danger">
        Updating the Skill ID will cause Voiceflow to overwrite any existing content on the development version of the Skill on Alexa Developer
        Console
      </Alert>

      <Input className="my-3" value={newAmazonID} onChange={(e) => setNewAmaonID(e.target.value)} placeholder="New Skill ID" />

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
                <MenuItem key={id} onClick={() => updateSelectedVendor(id)}>
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
  amazonID: Skill.amazonIDSelector,
  projectID: Skill.activeProjectIDSelector,
  amazonAccount: Account.amazonAccountSelector,
  vendorID: AlexaPublish.vendorIdSelector,
};

const mapDispatchToProps = {
  updateVendorSkillID: Account.updateVendorSkillID,
  updateSelectedVendor: Account.updateSelectedVendor,
};

export default connect(mapStateToProps, mapDispatchToProps)(Migrate);
