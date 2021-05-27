import React from 'react';

import Box from '@/components/Box';
import Section, { SectionToggleVariant, SectionVariant } from '@/components/Section';
import SvgIcon from '@/components/SvgIcon';
import * as Project from '@/ducks/project';
import * as Prototype from '@/ducks/prototype';
import { connect } from '@/hocs';
import { getDeviceList } from '@/pages/Prototype/constants';
import { FadeRightContainer } from '@/styles/animations';
import { ClassName } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import { Dimension, Item, Name } from './components';

const PrototypeDisplaySettings: React.FC<ConnectedPrototypeDisplaySettingsProps> = ({ device, platform, updateDevice }) => {
  const deviceList = getDeviceList(platform);

  React.useEffect(() => {
    // should default to option at the top of the list
    if (!device) {
      const type = deviceList[0]?.type;

      if (type) {
        updateDevice(type);
      }
    }
  }, []);

  const deviceInfo = React.useMemo(() => deviceList.find(({ type }) => type === device), [device, deviceList]);

  return (
    <FadeRightContainer>
      <Section
        header={deviceInfo?.name}
        headerToggle
        prefix={<SvgIcon icon={deviceInfo?.icon || 'echoShow'} />}
        collapseVariant={SectionToggleVariant.ARROW}
        initialOpen={true}
        variant={SectionVariant.DEVICE}
      >
        <Box minWidth="100%" pb="9">
          {deviceList.map(({ name, type, dimension }) => {
            const selected = device === type;

            return (
              <Item className={ClassName.DISPLAY_TYPE_ITEM} key={name} isActive={selected} onClick={() => updateDevice(type)}>
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
  platform: Project.activePlatformSelector,
};

const mapStateToDispatch = {
  updateDevice: Prototype.updatePrototypeVisualDevice,
};

type ConnectedPrototypeDisplaySettingsProps = ConnectedProps<typeof mapStateToProps, typeof mapStateToDispatch>;

export default connect(mapStateToProps, mapStateToDispatch)(PrototypeDisplaySettings) as React.FC;
