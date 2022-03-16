import { BlockText, Select } from '@voiceflow/ui';
import _sortBy from 'lodash/sortBy';
import React from 'react';
import { useSelector } from 'react-redux';

import Divider from '@/components/Divider';
import { NLPProviderLabels } from '@/constants';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';

import { getNplModelProvider } from '../constants';
import { ExportContext } from '../contexts';
import ModelIntentsSelect from './ModelIntentsSelect';

const ExportModel: React.FC = () => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const { modelExportProvider, setModelExportProvider } = React.useContext(ExportContext)!;
  const intents = useSelector(IntentV2.allIntentsSelector);
  const noModelData = intents.length === 0;

  const nplProviderOptions = React.useMemo(() => {
    // order alphabetically by label
    return _sortBy(getNplModelProvider(platform), (provider) => NLPProviderLabels[provider]);
  }, [platform]);

  React.useEffect(() => {
    if (nplProviderOptions.length === 1) {
      setModelExportProvider(nplProviderOptions[0]);
    }
  }, [nplProviderOptions]);

  return (
    <>
      <Select
        value={modelExportProvider}
        options={nplProviderOptions}
        onSelect={setModelExportProvider}
        searchable
        placeholder="Choose an option"
        getOptionLabel={(value) => NLPProviderLabels[value!]}
        disabled={nplProviderOptions.length === 1}
      />

      {noModelData ? (
        <BlockText fontSize={13} color="#62778c" lineHeight="normal" marginTop={12}>
          No model data currently exists
        </BlockText>
      ) : (
        <>
          <Divider style={{ margin: '20px 0px', width: 'calc(100% + 64px)' }} />
          <ModelIntentsSelect />
        </>
      )}
    </>
  );
};

export default ExportModel;
