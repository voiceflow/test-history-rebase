import type { CanvasTemplate } from '@realtime-sdk/models';
import type { BaseModels } from '@voiceflow/base-types';
import { createMultiAdapter } from 'bidirectional-adapter';

const canvasTemplateAdapter = createMultiAdapter<BaseModels.Version.CanvasTemplate, CanvasTemplate>(
  ({ id, name, color, nodeIDs }) => ({ id, name, color, nodeIDs }),
  ({ id, name, color, nodeIDs }) => ({ id, name, color, nodeIDs })
);

export default canvasTemplateAdapter;
