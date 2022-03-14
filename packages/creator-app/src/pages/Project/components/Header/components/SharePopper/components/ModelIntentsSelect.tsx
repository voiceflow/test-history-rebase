import * as Realtime from '@voiceflow/realtime-sdk';
import { GetOptionLabel, GetOptionValue } from '@voiceflow/ui';
import startCase from 'lodash/startCase';
import React from 'react';

import TagSelect from '@/components/TagSelect';
import * as IntentV2 from '@/ducks/intentV2';
import { useSelector } from '@/hooks';

import { ExportContext } from '../contexts';

const getIntentName: GetOptionLabel<Realtime.Intent> = (intent) => (intent ? startCase(intent.name.toLowerCase()) : null);
const getIntentValue: GetOptionValue<Realtime.Intent, string> = (intent) => intent?.id || null;

const ModelIntentsSelect: React.FC = () => {
  const { setModelExportIntents: setSelectedIntents, modelExportIntents: selectedIntents } = React.useContext(ExportContext)!;
  const intents = useSelector(IntentV2.allIntentsSelector);

  return (
    <TagSelect
      value={selectedIntents}
      options={intents}
      onChange={setSelectedIntents}
      getOptionKey={(option) => option.id}
      getOptionLabel={getIntentName}
      getOptionValue={getIntentValue}
      createInputPlaceholder="intents"
    />
  );
};

export default ModelIntentsSelect;
