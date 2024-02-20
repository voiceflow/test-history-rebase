import { cmsTrackingFactory } from '../utils/tracking.util';

const tracker = cmsTrackingFactory('Function');

export const { error, created, deleted, imported, exported, pageOpen, duplicated } = tracker;

export const testExecuted = tracker<{ success: 'Yes' | 'No' }>('Test Executed');
