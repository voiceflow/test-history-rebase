import { AlexaNode } from '@voiceflow/alexa-types';
import { BaseNode } from '@voiceflow/base-types';

import { visualOutPortsAdapter, visualOutPortsAdapterV2 } from '../base/visual';
import { createBlockAdapter } from '../utils';

const displayAdapter = createBlockAdapter<AlexaNode.Display.StepData, BaseNode.Visual.APLStepData>(
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

export const displayOutPortAdapterV2 = visualOutPortsAdapterV2;

export default displayAdapter;
