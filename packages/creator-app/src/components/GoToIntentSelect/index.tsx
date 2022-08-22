/* eslint-disable no-restricted-syntax */
import { BaseModels, Nullable } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Box, Link, Select } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as DiagramV2 from '@/ducks/diagramV2';
import { applySingleIntentNameFormatting } from '@/ducks/intent/utils';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import { useSelector } from '@/hooks';
import { getDiagramName } from '@/utils/diagram';
import { applyPlatformIntentNameFormatting, prettifyIntentName } from '@/utils/intent';

interface IntentOption {
  id: string;
  label: string;
  diagramID: string;
}

interface TopicIntentOption {
  id: string;
  label: string;
  options: Array<IntentOption>;
}

interface GoToIntentSelectProps {
  onChange: (value: Nullable<{ intentID: string; diagramID: string | null }>) => void;
  intentID?: Nullable<string>;
  diagramID?: Nullable<string>;
  placeholder?: string;
  clearOnSelectActive?: boolean;
}

const GoToIntentSelect: React.FC<GoToIntentSelectProps> = ({
  intentID,
  diagramID,
  onChange,
  placeholder = 'Behave as user triggered intent',
  clearOnSelectActive,
}) => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const intentSteps = useSelector(DiagramV2.intentStepsSelector);
  const activeDiagram = useSelector(DiagramV2.active.diagramSelector);
  const getIntentByID = useSelector(IntentV2.getIntentByIDSelector);
  const getDiagramByID = useSelector(DiagramV2.getDiagramByIDSelector);
  const globalIntentStepMap = useSelector(DiagramV2.globalIntentStepMapSelector);
  const intentNodeDataLookup = useSelector(CreatorV2.intentNodeDataLookupSelector);

  const isComponentActive = !activeDiagram?.type || activeDiagram.type === BaseModels.Diagram.DiagramType.COMPONENT;

  const globalOptions = React.useMemo(() => {
    const topicIntentOptions: TopicIntentOption[] = [];

    for (const diagramID of Object.keys(intentSteps)) {
      const diagram = getDiagramByID({ id: diagramID });

      if (!diagram || diagram.type !== BaseModels.Diagram.DiagramType.TOPIC) continue;

      const globalStepMap = globalIntentStepMap[diagramID];
      const intentOptions: IntentOption[] = [];

      for (const intentID of Object.keys(globalStepMap)) {
        const intent = getIntentByID({ id: intentID });

        if (!intent || !globalStepMap[intentID]?.length) continue;

        const formattedName = applyPlatformIntentNameFormatting(prettifyIntentName(applySingleIntentNameFormatting(platform, intent).name), platform);

        intentOptions.push({ id: `${diagramID}::${intent.id}`, label: formattedName, diagramID });
      }

      if (intentOptions.length) {
        topicIntentOptions.push({ id: diagramID, label: getDiagramName(diagram.name), options: intentOptions });
      }
    }

    return topicIntentOptions;
  }, [platform, intentSteps, getIntentByID, getDiagramByID, globalIntentStepMap]);

  const options = React.useMemo(() => {
    if (!activeDiagram?.id || !isComponentActive) return globalOptions;

    const componentOptions = Object.values(intentNodeDataLookup).map<IntentOption>(({ intent }) => ({
      id: `::${intent.id}`,
      label: applyPlatformIntentNameFormatting(prettifyIntentName(applySingleIntentNameFormatting(platform, intent).name), platform),
      diagramID: activeDiagram.id,
    }));

    if (!componentOptions.length) return globalOptions;

    return [
      {
        id: activeDiagram.id,
        label: activeDiagram.name,
        options: componentOptions,
      },
      ...globalOptions,
    ];
  }, [platform, activeDiagram?.id, activeDiagram?.name, isComponentActive, globalOptions]);

  const optionLookup = React.useMemo(
    () =>
      Utils.array.createMap(
        options.flatMap((option) => option.options),
        Utils.object.selectID
      ),
    [options]
  );

  const onSelect = (value: Nullable<string>) => {
    const [diagramID = null, intentID = null] = value?.split('::') ?? [];

    onChange(intentID ? { intentID, diagramID } : null);
  };

  const stepID = globalIntentStepMap[diagramID ?? '']?.[intentID ?? '']?.[0] ?? null;
  const topicValue = intentID && diagramID && stepID ? `${diagramID}::${intentID}` : null;
  const componentValue = isComponentActive && intentID && !!intentNodeDataLookup[intentID] ? `::${intentID}` : null;
  const value = isComponentActive && !topicValue ? componentValue : topicValue;

  return (
    <Select<IntentOption, TopicIntentOption, string>
      value={value}
      fullWidth
      grouped
      options={options}
      onSelect={onSelect}
      clearable={!!value}
      searchable
      placeholder={placeholder}
      getOptionValue={(option) => option?.id}
      getOptionLabel={(value) => (value ? optionLookup[value]?.label : undefined)}
      clearOnSelectActive={clearOnSelectActive}
      renderEmpty={({ close, search }) => (
        <Box flex={1} fontSize={13} textAlign="center">
          {!search ? 'No open intents exists in your project. ' : 'No open intents found. '}
          <Link href={Documentation.OPEN_INTENT} onClick={close}>
            Learn more
          </Link>
        </Box>
      )}
    />
  );
};

export default GoToIntentSelect;
