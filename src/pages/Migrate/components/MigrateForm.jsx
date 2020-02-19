import React from 'react';
import { Alert } from 'reactstrap';

import client from '@/client';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import DropdownButton from '@/components/DropdownButton';
import Input from '@/components/Input';
import Menu, { MenuItem } from '@/components/Menu';
import { amazonAccountSelector } from '@/ducks/account';
import { amznIDSelector, updatePublishInfo, updateVendor, vendorIdSelector } from '@/ducks/publish/alexa';
import { activeProjectIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';

function Migrate({ amznID, amazonAccount, projectID, updateVendor, updatePublishInfo, vendorID, onError, onSuccess }) {
  const [newAmznID, setNewAmznID] = React.useState('');

  const updateSkillID = async () => {
    try {
      const returnAmznID = await client.project.updateAmznId(projectID, vendorID, newAmznID);
      updatePublishInfo({ amznID: returnAmznID });
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
                <MenuItem key={id} onClick={() => updateVendor(id)}>
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
  amznID: amznIDSelector,
  projectID: activeProjectIDSelector,
  amazonAccount: amazonAccountSelector,
  vendorID: vendorIdSelector,
};

const mapDispatchToProps = {
  updatePublishInfo,
  updateVendor,
};

export default connect(mapStateToProps, mapDispatchToProps)(Migrate);
