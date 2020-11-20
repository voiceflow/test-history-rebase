import React from 'react';

import Drawer from '@/components/Drawer';
import Section, { SectionToggleVariant, SectionVariant } from '@/components/Section';
import { SUBMENU_WIDTH } from '@/components/SubMenu/constants';
import SvgIcon from '@/components/SvgIcon';
import * as Prototype from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { SlideOutDirection } from '@/styles/transitions';
import { ConnectedProps } from '@/types';

import { DEVICE_LIST, DISPLAY_SECTION_WIDTH, DeviceType } from '../../constants';
import { Dimension, Item, Name } from './components';

type PrototypeDisplaySettingsProps = {
  open?: boolean;
};

const PrototypeDisplaySettings: React.FC<PrototypeDisplaySettingsProps & ConnectedPrototypeDisplaySettingsProps> = ({
  open = false,
  selectedDisplay,
  platform,
  updateDisplay,
}) => {
  const deviceList = DEVICE_LIST[platform];

  const onDeviceItemClick = (device: DeviceType) => {
    updateDisplay(device);
  };

  React.useEffect(() => {
    // should default to option at the top of the list
    if (!selectedDisplay) {
      updateDisplay(Object.keys(deviceList)[0] as DeviceType);
    }
  }, []);

  const selectedDeviceInfo = Object.values(deviceList).find(({ name }) => name === selectedDisplay);
  return (
    <Drawer as="section" open={open} width={DISPLAY_SECTION_WIDTH} offset={SUBMENU_WIDTH} direction={SlideOutDirection.RIGHT}>
      <Section
        header={selectedDisplay}
        headerToggle
        prefix={<SvgIcon icon={selectedDeviceInfo?.icon || 'echoShow'} />}
        collapseVariant={SectionToggleVariant.ARROW}
        initialOpen={true}
        variant={SectionVariant.DEVICE}
      >
        <div style={{ minWidth: '100%', paddingBottom: '9px' }}>
          {Object.entries(deviceList).map(([device, { name, dimension }]) => {
            const selected = selectedDisplay === name;
            return (
              <Item key={name} selected={selected} onClick={() => onDeviceItemClick(device as DeviceType)}>
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
  selectedDisplay: Prototype.prototypeDisplaySelector,
  platform: Skill.activePlatformSelector,
};

const mapStateToDispatch = {
  updateDisplay: Prototype.updatePrototypeDisplay,
};

type ConnectedPrototypeDisplaySettingsProps = ConnectedProps<typeof mapStateToProps, typeof mapStateToDispatch>;

export default connect(mapStateToProps, mapStateToDispatch)(PrototypeDisplaySettings) as React.FC<PrototypeDisplaySettingsProps>;
