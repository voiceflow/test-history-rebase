import React from 'react';
import { Tooltip } from 'react-tippy';

import IconButton from '@/components/IconButton';
import { FeatureFlag } from '@/config/features';
import { PlatformType } from '@/constants';
import * as Feature from '@/ducks/feature';
import { setError } from '@/ducks/modal';
import { activePlatformSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { EditPermissionContext } from '@/pages/Canvas/contexts';
import PrototypeShare from '@/pages/Prototype/components/PrototypeShare';
import { SettingsModalConsumer } from '@/pages/Settings/contexts';

import Alexa from './Alexa';
import Google from './Google';
import ShareProject from './ShareProject';
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
                preventFocusStyle
                icon="cog"
                large
                onClick={toggle}
                iconProps={{ width: 16, height: 15 }}
              />
            </Tooltip>
          )}
        </SettingsModalConsumer>
      </SubTitleGroup>
      <SubTitleGroup>{props.isFeatureEnabled ? <ShareProject render /> : <PrototypeShare render />}</SubTitleGroup>
      {renderPlatform()}
    </>
  );
}

const mapStateToProps = {
  platform: activePlatformSelector,
  isFeatureEnabled: Feature.featureSelector,
};

const mapDispatchToProps = {
  setError,
};

const mergeProps = ({ isFeatureEnabled: featureSelector }) => ({
  isFeatureEnabled: featureSelector(FeatureFlag.PRICING_REVISIONS),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ActionGroup);
