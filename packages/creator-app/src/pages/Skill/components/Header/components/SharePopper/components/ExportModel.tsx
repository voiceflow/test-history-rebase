import { BlockText, Select } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import ChatWithUsLink from '@/components/ChatLink';
import { NLPProviderLabels } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';

import { getNplModelProvider } from '../constants';
import { ExportContext } from '../contexts';

const ExportModel: React.FC = () => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const { modelExportProvider, setModelExportProvider } = React.useContext(ExportContext)!;

  const nplProviderOptions = React.useMemo(() => getNplModelProvider(platform), [platform]);

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

      <BlockText fontSize={13} color="#62778c" lineHeight="normal" marginTop={12}>
        <span>Don't see the export format you're looking for? </span>
        <ChatWithUsLink>Contact Us.</ChatWithUsLink>
      </BlockText>
    </>
  );
};

export default ExportModel;
