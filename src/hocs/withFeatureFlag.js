import React from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';

import FeatureFlag from 'components/FeatureFlag';

export default ({ key = 'isFeatureAvailable', flag } = {}) => Wrapper => {
  function WithFeatureFlag(props) {
    return (
      <FeatureFlag flag={flag}>
        {isFeatureAvailable => <Wrapper {...props} {...{ [key]: isFeatureAvailable }} />}
      </FeatureFlag>
    );
  }

  WithFeatureFlag.displayName = wrapDisplayName(Wrapper, 'WithFeatureFlag');

  return WithFeatureFlag;
};
