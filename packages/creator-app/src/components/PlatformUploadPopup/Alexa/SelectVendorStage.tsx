import { BoxFlex, Text } from '@voiceflow/ui';
import React from 'react';

import { PublishContext } from '@/contexts';
import * as Account from '@/ducks/account';
import { useDispatch, useSelector, useTrackingEvents } from '@/hooks';
import { isReady } from '@/utils/job';

import { ProjectItem, StageContainer } from '../components';

interface SelectVendorStageProps {
  setVendorSelected: (vendorSelected: boolean) => void;
}

const SelectVendorStage: React.FC<SelectVendorStageProps> = ({ setVendorSelected }) => {
  const [trackingEvents] = useTrackingEvents();
  const { job, publish } = React.useContext(PublishContext)!;
  const vendors = useSelector(Account.amazonVendorsSelector);
  const activateVendor = useDispatch(Account.amazon.activateVendor);

  const onVendorSelect = async (vendorID: string) => {
    activateVendor(vendorID);

    // start the job
    trackingEvents.trackActiveProjectPublishAttempt();
    if (isReady(job)) {
      await publish();
    }

    setVendorSelected(true);
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
