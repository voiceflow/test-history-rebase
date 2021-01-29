import { useSelector } from 'react-redux';

import { PlatformType } from '@/constants';

import { activePlatformSelector } from './skill/selectors';

export const usePlatform = () => {
  return useSelector(activePlatformSelector);
};

export const useIsPlatform = (platform: PlatformType) => {
  return platform === usePlatform();
};
