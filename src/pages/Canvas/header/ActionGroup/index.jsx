import React from 'react';
import { Tooltip } from 'react-tippy';

import IconButton from '@/components/IconButton';
import { PlatformType } from '@/constants';
import { setError } from '@/ducks/modal';
import { activePlatformSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { EditPermissionContext } from '@/pages/Canvas/contexts';
import { SettingsModalConsumer } from '@/pages/Settings/contexts';
import ShareTest from '@/pages/Testing/ShareTest';

import Alexa from './Alexa';
import Google from './Google';
import { SubTitleGroup } from './styled';

function ActionGroup(props) {
  const { platform } = props;
  const { isViewer } = React.useContext(EditPermissionContext);

  const renderPlatform = () => {
    if (platform === PlatformType.ALEXA) return <Alexa />;
    return <Google />;
  };

  return (
    <>
      <SubTitleGroup>
        <SettingsModalConsumer>
          {({ isEnabled, toggle }) => (
            <Tooltip disabled={isViewer} title="Settings" position="bottom">
              <IconButton
                disabled={isViewer}
                active={isEnabled}
                variant="outline"
                icon="cog"
                large
                onClick={toggle}
                iconProps={{ width: 16, height: 15 }}
              />
            </Tooltip>
          )}
        </SettingsModalConsumer>
      </SubTitleGroup>
      <SubTitleGroup>
        <ShareTest render />
      </SubTitleGroup>

      {renderPlatform()}
    </>
  );
}

const mapStateToProps = {
  platform: activePlatformSelector,
};

const mapDispatchToProps = {
  setError,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionGroup);
