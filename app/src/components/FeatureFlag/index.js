import React from 'react';
import PropTypes from 'prop-types';

import { FeatureFlagContextConsumer } from 'contexts';

export default function FeatureFlag({ flag, children }) {
  const isRenderProps = typeof children === 'function';

  return (
    <FeatureFlagContextConsumer>
      {availableFeatures => {
        const isFeatureAvailable = availableFeatures.includes(flag);

        return isRenderProps ? children(isFeatureAvailable) : isFeatureAvailable ? children : null;
      }}
    </FeatureFlagContextConsumer>
  );
}

FeatureFlag.propTypes = {
  flag: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
};
