import { Box, BoxFlex, Text } from '@voiceflow/ui';
import React from 'react';

import ProjectItem from '@/components/PlatformUploadPopup/components/ProjectItem';
import * as Account from '@/ducks/account';
import { useDispatch, useSelector, useTrackingEvents } from '@/hooks';
import { AlexaPublishJob } from '@/models';
import { StageComponentProps } from '@/platforms/types';

const SelectVendorStage: React.FC<StageComponentProps<AlexaPublishJob.SelectVendorsStage>> = ({ restart }) => {
  const [trackingEvents] = useTrackingEvents();
  const vendors = useSelector(Account.amazonVendorsSelector);
  const selectVendor = useDispatch(Account.amazon.selectVendor);

  const onVendorSelect = async (vendorID: string) => {
    await selectVendor(vendorID);

    // start the job
    trackingEvents.trackActiveProjectPublishAttempt();
    await restart();
  };

  return (
    <Box width={254}>
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
    </Box>
  );
};

export default SelectVendorStage;
