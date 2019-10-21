import React from 'react';
import { Tooltip } from 'react-tippy';

import RoundButton from '@/components/Button/RoundButton';
import { PlatformType } from '@/constants';
import { SettingsModalConsumer } from '@/containers/CanvasV2/contexts/SettingsModalContext';
import ShareTest from '@/containers/Testing/ShareTest';
import { setError } from '@/ducks/modal';
import { activePlatformSelector } from '@/ducks/skill';
import { connect } from '@/hocs';

import Alexa from './Alexa';
import Google from './Google';
import { SubTitleGroup } from './styled';

function ActionGroup(props) {
  const { platform } = props;

  const renderPlatform = () => {
    if (platform === PlatformType.ALEXA) return <Alexa />;
    return <Google />;
  };

  return (
    <>
      <SubTitleGroup>
        <SettingsModalConsumer>
          {({ isEnabled, toggle }) => (
            <Tooltip title="Settings" position="bottom">
              <RoundButton active={isEnabled} icon="cog" onClick={toggle} imgSize={15} />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionGroup);
