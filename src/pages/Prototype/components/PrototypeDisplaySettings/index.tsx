import React from 'react';

import Box from '@/components/Box';
import Section, { SectionToggleVariant, SectionVariant } from '@/components/Section';
import SvgIcon from '@/components/SvgIcon';
import * as Prototype from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { DEVICE_LIST, DeviceType } from '@/pages/Prototype/constants';
import { FadeRightContainer } from '@/styles/animations';
import { ConnectedProps } from '@/types';

import { Dimension, Item, Name } from './components';

const PrototypeDisplaySettings: React.FC<ConnectedPrototypeDisplaySettingsProps> = ({ device, platform, updateDevice }) => {
  const deviceList = DEVICE_LIST[platform];

  React.useEffect(() => {
    // should default to option at the top of the list
    if (!device) {
      updateDevice(Object.keys(deviceList)[0] as DeviceType);
    }
  }, []);

  const selectedDeviceInfo = Object.entries(deviceList).find(([deviceType]) => deviceType === device)?.[1];

  return (
    <FadeRightContainer>
      <Section
        header={device}
        prefix={<SvgIcon icon={selectedDeviceInfo?.icon || 'echoShow'} />}
        variant={SectionVariant.DEVICE}
        initialOpen={true}
        headerToggle
        collapseVariant={SectionToggleVariant.ARROW}
      >
        <Box minWidth="100%" pb="9">
          {Object.entries(deviceList as Required<typeof deviceList>).map(([deviceType, { name, dimension }]) => {
            const selected = device === deviceType;

            return (
              <Item key={name} isActive={selected} onClick={() => updateDevice(deviceType as DeviceType)}>
                <Name>{name}</Name>

                <Dimension selected={selected}>
                  {dimension.width} x {dimension.height}
                </Dimension>
              </Item>
            );
          })}
        </Box>
      </Section>
    </FadeRightContainer>
  );
};

const mapStateToProps = {
  device: Prototype.prototypeVisualDeviceSelector,
  platform: Skill.activePlatformSelector,
};

const mapStateToDispatch = {
  updateDevice: Prototype.updatePrototypeVisualDevice,
};

type ConnectedPrototypeDisplaySettingsProps = ConnectedProps<typeof mapStateToProps, typeof mapStateToDispatch>;

export default connect(mapStateToProps, mapStateToDispatch)(PrototypeDisplaySettings) as React.FC;
