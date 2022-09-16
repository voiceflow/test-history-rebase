import { BoxFlex, Text } from '@voiceflow/ui';
import React from 'react';

import ProjectItem from '@/components/PlatformUploadPopup/components/ProjectItem';
import StageContainer from '@/components/PlatformUploadPopup/components/StageContainer';
import { PublishContext } from '@/contexts/PublishContext';
import * as Account from '@/ducks/account';
import { useDispatch, useSelector, useTrackingEvents } from '@/hooks';
import { isReady } from '@/utils/job';

const SelectVendorStage: React.FC = () => {
  const [trackingEvents] = useTrackingEvents();
  const { job, start } = React.useContext(PublishContext)!;
  const vendors = useSelector(Account.amazonVendorsSelector);
  const selectVendor = useDispatch(Account.amazon.selectVendor);

  const onVendorSelect = async (vendorID: string) => {
    await selectVendor(vendorID);

    // start the job
    trackingEvents.trackActiveProjectPublishAttempt();
    if (isReady(job)) {
      await start();
    }
  };

  return (
    <StageContainer noPadding>
      <BoxFlex fullWidth height={42} mt={8} padding="12px 21px 10px 24px">
        <Text textAlign="left" mb={11} fontWeight={600} fontSize={15}>
          Select Vendor
        </Text>
      </BoxFlex>

      <BoxFlex maxHeight={400} mb={8} column style={{ overflow: 'auto' }}>
        {vendors.map(({ id, name }) => (
          <BoxFlex key={id} fullWidth onClick={() => onVendorSelect(id)}>
            <ProjectItem>{name || id}</ProjectItem>
          </BoxFlex>
        ))}
      </BoxFlex>
    </StageContainer>
  );
};

export default SelectVendorStage;
