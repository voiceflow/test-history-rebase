import { textEditorContentAdapter } from '@/client/adapters/textEditor';

import { createBlockAdapter } from './utils';

const displayBlockAdapter = createBlockAdapter(
  ({ display_id, datasource, apl_commands, update_on_change, type, display_type, background_image, splash_header, json_file_name, version }) => ({
    displayID: display_id || null,
    datasource,
    aplCommands: apl_commands,
    updateOnChange: update_on_change,
    type,
    displayType: display_type,
    backgroundImage: background_image,
    splashHeader: textEditorContentAdapter.fromDB(splash_header),
    jsonFileName: json_file_name,
    version,
  }),
  ({ displayID, datasource, aplCommands, updateOnChange, type, displayType, backgroundImage, splashHeader, jsonFileName, version }) => ({
    display_id: displayID,
    datasource,
    apl_commands: aplCommands,
    update_on_change: updateOnChange,
    type,
    display_type: displayType,
    background_image: backgroundImage,
    splash_header: textEditorContentAdapter.toDB(splashHeader),
    json_file_name: jsonFileName,
    version,
  })
);

export default displayBlockAdapter;
