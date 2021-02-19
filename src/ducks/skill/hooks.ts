import { useSelector } from 'react-redux';

import { PlatformType } from '@/constants';

import { activePlatformSelector } from './skill/selectors';

export const usePlatform = () => useSelector(activePlatformSelector);

export const useIsPlatform = (platform: PlatformType) => platform === usePlatform();
