import { cmsTrackingFactory } from '../utils/tracking.util';

const tracker = cmsTrackingFactory('Variable');

export const { created, deleted, updated } = tracker;

export const defaultValueSet = tracker<{ updated: boolean }>('Default Value Set');
