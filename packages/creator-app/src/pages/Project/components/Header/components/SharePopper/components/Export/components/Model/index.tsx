import { BlockText, Divider, Select } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import IntentsSelect from '@/components/IntentsSelect';
import UpgradeOption from '@/components/UpgradeOption';
import { Permission } from '@/config/permissions';
import { getNLUExportLimitDetails, isGatedNLUExportType } from '@/config/planLimits/nluExport';
import { NLPProvider, NLPProviderLabels } from '@/constants';
import * as IntentV2 from '@/ducks/intentV2';
import { UpgradePrompt } from '@/ducks/tracking';
import { usePermission } from '@/hooks';

import { ExportContext } from '../../Context';

const ExportModel: React.FC<{
  selectedIntentsIds?: string[];
}> = ({ selectedIntentsIds }) => {
  const {
    modelExportProvider,
    setModelExportProvider,
    setModelExportIntents,
    modelExportIntents,
    nlpProviderOptions,
    setCanExport,
    setCheckedExportIntents,
  } = React.useContext(ExportContext)!;
  const intents = useSelector(IntentV2.allIntentsSelector);
  const noModelData = intents.length === 0;
  const [permissionToExport] = usePermission(Permission.NLU_EXPORT_ALL);
  const [permissionToExportCSV] = usePermission(Permission.NLU_EXPORT_CSV);
  const [selectedIntents, setSelectedIntents] = React.useState(modelExportIntents);

  const modelExportSelection = (value: NLPProvider) => {
    setModelExportProvider(value);
    if ((!permissionToExportCSV && value === NLPProvider.VF_CSV) || (value !== NLPProvider.VF_CSV && !permissionToExport)) {
      setCanExport(false);
    } else {
      setCanExport(true);
    }
  };

  React.useEffect(() => {
    if (nlpProviderOptions.length === 1) {
      setModelExportProvider(nlpProviderOptions[0]);
    }
  }, [nlpProviderOptions]);

  const handleOnChange = (intents: string[]) => {
    setModelExportIntents(intents);
    setSelectedIntents(intents);
  };

  React.useEffect(() => {
    if (selectedIntentsIds) {
      setCheckedExportIntents(selectedIntentsIds);
      setSelectedIntents(Array.from(new Set([...selectedIntentsIds, ...modelExportIntents])));
    }
  }, [selectedIntentsIds]);

  return (
    <>
      <Select
        value={modelExportProvider}
        options={nlpProviderOptions}
        onSelect={modelExportSelection}
        disabled={nlpProviderOptions.length === 1}
        searchable
        placeholder="Choose an option"
        getOptionLabel={(value) => value && NLPProviderLabels[value]}
        renderOptionLabel={(option, searchLabel, getOptionLabel, getOptionValue, { isFocused }) => (
          <UpgradeOption
            option={option}
            isFocused={isFocused}
            searchLabel={searchLabel}
            getOptionLabel={getOptionLabel}
            getOptionValue={getOptionValue}
            isGated={isGatedNLUExportType(option, permissionToExport, permissionToExportCSV)}
            planDetails={getNLUExportLimitDetails(option)}
            promptOrigin={UpgradePrompt.EXPORT_NLU}
          />
        )}
      />

      {noModelData ? (
        <BlockText fontSize={13} color="#62778c" lineHeight="normal" marginTop={12}>
          No model data currently exists
        </BlockText>
      ) : (
        <>
          <Divider style={{ margin: '20px 0px', width: 'calc(100% + 64px)', backgroundColor: 'rgb(234 239 242)' }} />
          <IntentsSelect value={selectedIntents} onChange={handleOnChange} />
        </>
      )}
    </>
  );
};

export default ExportModel;
