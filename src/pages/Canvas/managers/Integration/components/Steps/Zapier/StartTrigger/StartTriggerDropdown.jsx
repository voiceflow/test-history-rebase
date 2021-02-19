import React from 'react';

import DropdownHeader from '../../components/StepDropdown';
import FeedAddUserModal from './addUserModal';
import StartTriggerSection from './StartTriggerSection';

function StartTrigger({ data, onChange, isOpened, toggleStep, openNextStep }) {
  const triggerUser = data.user?.user_id || '';
  return (
    <DropdownHeader headerText="Start Trigger" headerSuffixText={triggerUser} isOpened={isOpened} toggle={toggleStep}>
      <StartTriggerSection openNextStep={openNextStep} user_modal={FeedAddUserModal} data={data} onChange={onChange} />
    </DropdownHeader>
  );
}

export default StartTrigger;
