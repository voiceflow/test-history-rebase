import { Node } from '@voiceflow/alexa-types';
import { Node as BaseNode } from '@voiceflow/base-types';

import { visualOutPortsAdapter } from '../base/visual';
import { createBlockAdapter } from '../utils';

const displayAdapter = createBlockAdapter<Node.Display.StepData, BaseNode.Visual.APLStepData>(
  ({ type, title, imageURL, document, datasource, aplCommands, jsonFileName }) => ({
    title,
    aplType: type,
    imageURL,
    document,
    datasource,
    visualType: BaseNode.Visual.VisualType.APL,
    aplCommands,
    jsonFileName,
  }),
  ({ title = '', aplType, imageURL = '', document = '', datasource = '', aplCommands, jsonFileName = '' }) => ({
    type: aplType,
    title,
    imageURL,
    document,
    datasource,
    aplCommands,
    jsonFileName,
  })
);

export const displayOutPortAdapter = visualOutPortsAdapter;

export default displayAdapter;
