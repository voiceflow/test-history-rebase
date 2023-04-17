import { Utils } from '@voiceflow/common';
import { BlockText, Box, createDividerMenuItemOption, defaultMenuLabelRenderer, isNotUIOnlyMenuItemOption, Select, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import IntentsSelect from '@/components/IntentsSelect';
import PermittedMenuItem from '@/components/PermittedMenuItem';
import * as NLP from '@/config/nlp';
import { Permission } from '@/constants/permissions';

import { Context } from './Context';

interface ModelProps {
  selectedIntentsIds?: string[];
}

export const Model: React.FC<ModelProps> = ({ selectedIntentsIds }) => {
  const { exportNLPType, setExportNLPType, setExportIntents, exportIntents, nlpTypes, setCheckedExportIntents } = React.useContext(Context)!;

  const [selectedIntents, setSelectedIntents] = React.useState(exportIntents);

  const exportNLPConfig = exportNLPType && NLP.Config.get(exportNLPType);
  const nlpFileExtension = exportNLPConfig?.export?.defaultExtension;

  const nluOptions = React.useMemo(() => {
    const supported = nlpTypes.filter((nlpType) => !!NLP.Config.get(nlpType).export);

    return supported.includes(NLP.Constants.NLPType.VOICEFLOW) && supported.length > 1
      ? [NLP.Constants.NLPType.VOICEFLOW, createDividerMenuItemOption(), ...Utils.array.withoutValue(supported, NLP.Constants.NLPType.VOICEFLOW)]
      : supported;
  }, [nlpTypes]);

  const modelExportSelection = (value: NLP.Constants.NLPType | null) => {
    if (!value) return;

    setExportNLPType(value as NLP.Constants.NLPType);
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
        maxHeight="334px"
        renderOptionLabel={(nlpType, searchLabel, getOptionLabel, getOptionValue, options) => (
          <PermittedMenuItem
            data={{ nlpType }}
            label={defaultMenuLabelRenderer(nlpType, searchLabel, getOptionLabel, getOptionValue, options)}
            isFocused={options.isFocused}
            permission={nlpType === NLP.Constants.NLPType.VOICEFLOW ? Permission.NLU_EXPORT_CSV : Permission.NLU_EXPORT_ALL}
            tooltipProps={{ offset: [0, 30] }}
          />
        )}
      />

      {/* change this text */}
      <BlockText fontSize={13} color="#62778c" lineHeight="normal" marginTop={11}>
        <span>
          {nluOptions.length === 1 && exportNLPType === NLP.Constants.NLPType.VOICEFLOW
            ? 'Export as .CSV'
            : `Export as ${nlpFileExtension?.toUpperCase() || '.CSV'}, or as consumable file for any NLU vendor.`}
        </span>
      </BlockText>

      <label style={{ marginTop: 24 }}>Intents</label>

      <IntentsSelect value={selectedIntents} onChange={handleOnChange} />
    </Box>
  );
};
