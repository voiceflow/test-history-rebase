import React from 'react';
import { useTheme } from 'styled-components';

import Drawer from '@/components/Drawer';
import Section, { SectionToggleVariant, SectionVariant } from '@/components/Section';
import SvgIcon from '@/components/SvgIcon';
import * as Prototype from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { DEVICE_LIST, DeviceType } from '@/pages/Prototype/constants';
import { Theme } from '@/styles/theme';
import { SlideOutDirection } from '@/styles/transitions';
import { ConnectedProps } from '@/types';

import { Dimension, Item, Name } from './components';

type PrototypeDisplaySettingsProps = {
  open?: boolean;
};

const PrototypeDisplaySettings: React.FC<PrototypeDisplaySettingsProps & ConnectedPrototypeDisplaySettingsProps> = ({
  open = false,
  device,
  platform,
  updateDevice,
}) => {
  const theme = useTheme() as Theme;
  const deviceList = DEVICE_LIST[platform];

  React.useEffect(() => {
    // should default to option at the top of the list
    if (!device) {
      updateDevice(Object.keys(deviceList)[0] as DeviceType);
    }
  }, []);

  const selectedDeviceInfo = Object.entries(deviceList).find(([deviceType]) => deviceType === device)?.[1];

  return (
    <Drawer
      as="section"
      open={open}
      width={theme.components.displaySettings.width}
      offset={theme.components.subMenu.width}
      direction={SlideOutDirection.RIGHT}
    >
      <Section
        header={device}
        headerToggle
        prefix={<SvgIcon icon={selectedDeviceInfo?.icon || 'echoShow'} />}
        collapseVariant={SectionToggleVariant.ARROW}
        initialOpen={true}
        variant={SectionVariant.DEVICE}
      >
        <div style={{ minWidth: '100%', paddingBottom: '9px' }}>
          {Object.entries(deviceList as Required<typeof deviceList>).map(([deviceType, { name, dimension }]) => {
            const selected = device === deviceType;
            return (
              <Item key={name} selected={selected} onClick={() => updateDevice(deviceType as DeviceType)}>
                <Name>{name}</Name>
                <Dimension selected={selected}>
                  {dimension.width} x {dimension.height}
                </Dimension>
              </Item>
            );
          })}
        </div>
      </Section>
    </Drawer>
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

export default connect(mapStateToProps, mapStateToDispatch)(PrototypeDisplaySettings) as React.FC<PrototypeDisplaySettingsProps>;
