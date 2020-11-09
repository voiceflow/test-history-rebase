import { DisplayType as StepDisplayType, StepData as DisplayData } from '@voiceflow/alexa-types/build/nodes/display';

import { DisplayType } from '@/constants';
import { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';

const displayAdapter = createBlockAdapter<DisplayData, NodeData.Display>(
  ({ type, imageURL, title, datasource, document, aplCommands, jsonFileName }) => ({
    displayType: type === StepDisplayType.JSON ? DisplayType.ADVANCED : DisplayType.SPLASH,
    displayID: null,
    dataSource: datasource,
    aplCommands,
    backgroundImage: imageURL,
    splashHeader: title,
    jsonFileName,
    document,
    updateOnChange: true,
  }),
  ({ displayType, dataSource, aplCommands, backgroundImage, splashHeader, document, jsonFileName }) => ({
    type: displayType === DisplayType.ADVANCED ? StepDisplayType.JSON : StepDisplayType.SPLASH,
    imageURL: backgroundImage || '',
    title: splashHeader,
    datasource: dataSource || '',
    document: document || '',
    aplCommands,
    jsonFileName: jsonFileName || '',
  })
);

export default displayAdapter;
