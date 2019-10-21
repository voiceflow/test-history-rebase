import { createBlockAdapter } from './utils';

const displayBlockAdapter = createBlockAdapter(
  ({ display_id, datasource, apl_commands, update_on_change, type }) => ({
    displayID: display_id || null,
    datasource,
    aplCommands: apl_commands,
    updateOnChange: update_on_change,
    type,
  }),
  ({ displayID, datasource, aplCommands, updateOnChange, type }) => ({
    display_id: displayID,
    datasource,
    apl_commands: aplCommands,
    update_on_change: updateOnChange,
    type,
  })
);

export default displayBlockAdapter;
