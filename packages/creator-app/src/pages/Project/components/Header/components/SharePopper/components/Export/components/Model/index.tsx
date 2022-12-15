import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { BlockText, Box, createDividerMenuItemOption, isNotUIOnlyMenuItemOption, Select, SvgIcon } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import IntentsSelect from '@/components/IntentsSelect';
import UpgradeOption from '@/components/UpgradeOption';
import * as NLP from '@/config/nlp';
import { Permission } from '@/config/permissions';
import { getNLUExportLimitDetails, isGatedNLUExportType } from '@/config/planLimits/nluExport';
import * as ProjectV2 from '@/ducks/projectV2';
import { UpgradePrompt } from '@/ducks/tracking';
import { useActiveProjectNLUConfig, usePermission } from '@/hooks';

import { ExportContext } from '../../Context';

const ExportModel: React.FC<{
  selectedIntentsIds?: string[];
}> = ({ selectedIntentsIds }) => {
  const nluConfig = useActiveProjectNLUConfig();

  const { exportNLPType, setExportNLPType, setExportIntents, exportIntents, nlpTypes, setCanExport, setCheckedExportIntents } =
    React.useContext(ExportContext)!;

  const platform = useSelector(ProjectV2.active.platformSelector);
  const [permissionToExport] = usePermission(Permission.NLU_EXPORT_ALL);
  const [permissionToExportCSV] = usePermission(Permission.NLU_EXPORT_CSV);
  const [selectedIntents, setSelectedIntents] = React.useState(exportIntents);

  const exportNLPConfig = exportNLPType && NLP.Config.get(exportNLPType);
  const nluOptions = React.useMemo(() => {
    const supported = nlpTypes.filter((nlpType) => !!NLP.Config.get(nlpType).export);

    return supported.includes(NLP.Constants.NLPType.VOICEFLOW) && supported.length > 1
      ? [NLP.Constants.NLPType.VOICEFLOW, createDividerMenuItemOption(), ...Utils.array.withoutValue(supported, NLP.Constants.NLPType.VOICEFLOW)]
      : supported;
  }, [nlpTypes]);

  const modelExportSelection = (value: NLP.Constants.NLPType | null) => {
    if (!value) return;

    setExportNLPType(value as NLP.Constants.NLPType);

    const isVoiceflow = value === NLP.Constants.NLPType.VOICEFLOW;

    if ((!permissionToExportCSV && isVoiceflow) || (!isVoiceflow && !permissionToExport)) {
      setCanExport(false);
    } else {
      setCanExport(true);
    }
  };

  React.useEffect(() => {
    const nluOptionsWithoutDivider = nluOptions.filter(isNotUIOnlyMenuItemOption);
    if (nluOptionsWithoutDivider.length === 1) {
      setExportNLPType(nluOptionsWithoutDivider[0]);
    }
  }, [nluOptions]);

  const handleOnChange = (intents: string[]) => {
    setExportIntents(intents);
    setSelectedIntents(intents);
  };

  React.useEffect(() => {
    if (selectedIntentsIds) {
      setCheckedExportIntents(selectedIntentsIds);
      setSelectedIntents(Array.from(new Set([...selectedIntentsIds, ...exportIntents])));
    }
  }, [selectedIntentsIds]);

  return (
    <Box mt={20}>
      <BlockText fontSize={15} color="#62778C" fontWeight={600} marginBottom={11}>
        Export format
      </BlockText>
      <Select
        value={exportNLPType}
        prefix={exportNLPConfig ? <SvgIcon icon={exportNLPConfig.icon.name} color={exportNLPConfig.icon.color} /> : null}
        options={nluOptions}
        onSelect={modelExportSelection}
        disabled={nluOptions.length === 1}
        searchable
        getOptionKey={(value) => value}
        getOptionValue={(value) => value}
        placeholder="Choose an option"
        getOptionLabel={(value) => value && NLP.Config.get(value).name}
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

      {/* change this text */}
      <BlockText fontSize={13} color="#62778c" lineHeight="normal" marginTop={11}>
        <span>
          {nluOptions.length === 1 && exportNLPType === NLP.Constants.NLPType.VOICEFLOW ? (
            'Export as .CSV'
          ) : (
            <>
              Export as .CSV, or as consumable file for {Realtime.Utils.typeGuards.isVoiceflowPlatform(platform) ? 'any NLU vendor' : nluConfig.name}.
            </>
          )}
        </span>
      </BlockText>

      <label style={{ marginTop: 24 }}>Intents</label>

      <IntentsSelect value={selectedIntents} onChange={handleOnChange} />
    </Box>
  );
};

export default ExportModel;
