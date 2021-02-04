import { StepData as DisplayData } from '@voiceflow/alexa-types/build/nodes/display';
import { APLStepData, VisualType } from '@voiceflow/general-types/build/nodes/visual';

import { createBlockAdapter } from '../utils';

const displayAdapter = createBlockAdapter<DisplayData, APLStepData>(
  ({ type, title, imageURL, document, datasource, aplCommands, jsonFileName }) => ({
    title,
    aplType: type,
    imageURL,
    document,
    datasource,
    visualType: VisualType.APL,
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

export default displayAdapter;
