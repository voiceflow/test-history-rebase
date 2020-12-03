import React from 'react';

import { Flex } from '@/components/Box';
import { Text } from '@/components/Text';
import * as Account from '@/ducks/account';
import { connect } from '@/hocs';
import { useTrackingEvents } from '@/hooks';
import { PublishContext } from '@/pages/Skill/contexts';
import { ConnectedProps } from '@/types';
import { isReady } from '@/utils/job';

import { ProjectItem, StageContainer } from '../components';

type SelectVendorStageProps = {
  setVendorSelected: (vendorSelected: boolean) => void;
};

const SelectVendorStage: React.FC<SelectVendorStageProps & ConnectedSelectVendorStageProps> = ({
  setVendorSelected,
  vendors,
  updateSelectedVendor,
}) => {
  const [trackingEvents] = useTrackingEvents();
  const { job, publish } = React.useContext(PublishContext)!;

  const onVendorSelect = async (vendorID: string) => {
    updateSelectedVendor(vendorID);

    // start the job
    trackingEvents.trackActiveProjectPublishAttempt();
    if (isReady(job)) {
      await publish();
    }

    setVendorSelected(true);
  };

  return (
    <StageContainer noPadding>
      <Flex fullWidth height={42} mt={8} padding="12px 21px 10px 24px">
        <Text textAlign="left" mb={11} fontWeight={600} fontSize={15}>
          Select Vendor
        </Text>
      </Flex>

      <Flex maxHeight={400} mb={8} column style={{ overflow: 'auto' }}>
        {vendors.map(({ id, name }) => (
          <Flex key={id} fullWidth height={42} onClick={() => onVendorSelect(id)}>
            <ProjectItem>{name || id}</ProjectItem>
          </Flex>
        ))}
      </Flex>
    </StageContainer>
  );
};

const mapStateToProps = {
  vendors: Account.amazonVendorsSelector,
};

const mapDispatchToProps = {
  updateSelectedVendor: Account.updateSelectedVendor,
};

type ConnectedSelectVendorStageProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(SelectVendorStage) as React.FC<SelectVendorStageProps>;
