/*
  We need to store template nodes, ports, and links in the redux
  it's basically a copy of creatorV2, extending with Crud data, but instead of
  active diagram, we use the template diagram.
  That's why we are reusing state factory from creatorV2
*/

import { createEmptyState } from '@/ducks/creatorV2/constants';
import { createCRUDState } from '@/ducks/utils/crudV2';

import { CanvasTemplateState } from './types';

export const STATE_KEY = 'canvasTemplate';

export const createInitialState = (): CanvasTemplateState => ({
  ...createCRUDState(),
  ...createEmptyState(),
});

export const INITIAL_STATE = createInitialState();
