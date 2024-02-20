import { cmsTrackingFactory } from '../utils/tracking.util';

const tracker = cmsTrackingFactory('Folder');

export const { created, deleted } = tracker;
