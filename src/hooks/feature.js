import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as Feature from '@/ducks/feature';

const FEATURE_REFRESH_TIMEOUT = 30 * 1000;

// eslint-disable-next-line import/prefer-default-export
export const useFeature = (featureID, timeout = FEATURE_REFRESH_TIMEOUT) => {
  const dispatch = useDispatch();
  const isEnabled = useSelector(Feature.isFeatureEnabledSelector)(featureID);
  const isReady = isEnabled != null;

  useEffect(() => {
    const refreshFeature = () => dispatch(Feature.refreshFeature(featureID));
    setInterval(refreshFeature, timeout);

    return () => clearInterval(refreshFeature);
  }, [featureID, timeout]);

  return { isEnabled, isReady };
};
