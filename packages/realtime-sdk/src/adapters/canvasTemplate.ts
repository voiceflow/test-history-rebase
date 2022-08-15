import { CanvasTemplate } from '@realtime-sdk/models';
import { BaseModels } from '@voiceflow/base-types';
import createAdapter from 'bidirectional-adapter';

const canvasTemplateAdapter = createAdapter<BaseModels.Version.CanvasTemplate, CanvasTemplate>(
  ({ id, name, color, nodeIDs }) => ({ id, name, color, nodeIDs }),
  ({ id, name, color, nodeIDs }) => ({ id, name, color, nodeIDs })
);

export default canvasTemplateAdapter;
