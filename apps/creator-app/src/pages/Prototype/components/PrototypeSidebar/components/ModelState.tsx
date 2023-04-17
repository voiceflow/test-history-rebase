import { BaseModels } from '@voiceflow/base-types';
import { BlockText, Box, Flex } from '@voiceflow/ui';
import React from 'react';

import DonutChart from '@/components/DonutChart';
import Duration from '@/components/Duration';
import { ModelDiff } from '@/utils/prototypeModel';

interface ModelStateProps {
  diff: ModelDiff;
  trainedModel: BaseModels.PrototypeModel;
  lastTrainedTime: number;
}

enum DonutKey {
  TRAINED = 'TRAINED',
  UNTRAINED = 'UNTRAINED',
}

const ModelState: React.FC<ModelStateProps> = ({ diff, trainedModel, lastTrainedTime }) => {
  const data = React.useMemo(() => {
    const updatedDeletedSlotsCount = diff.slots.deleted.length + diff.slots.updated.length;
    const updatedDeletedIntentsCount = diff.intents.deleted.length + diff.intents.updated.length;

    const trainedSlotsCount = trainedModel.slots.length - updatedDeletedSlotsCount;
    const trainedIntentsCount = trainedModel.intents.length - updatedDeletedIntentsCount;

    const untrainedSlotsCount = diff.slots.new.length + updatedDeletedSlotsCount;
    const untrainedIntentsCount = diff.intents.new.length + updatedDeletedIntentsCount;

    const trained = trainedSlotsCount + trainedIntentsCount;
    const untrained = untrainedSlotsCount + untrainedIntentsCount;

    return [
      { key: DonutKey.TRAINED, color: '#5d9df5', value: trained, slots: trainedSlotsCount, intents: trainedIntentsCount },
      { key: DonutKey.UNTRAINED, color: '#f1467b', value: untrained, slots: untrainedSlotsCount, intents: untrainedIntentsCount },
    ];
  }, [diff, trainedModel]);

  return (
    <DonutChart
      size={120}
      data={data}
      legend={{
        [DonutKey.TRAINED]: {
          label: 'Trained',
          gradient: 'linear-gradient(to bottom, rgba(93, 157, 245, 0.12), rgba(93, 157, 245, 0.24) 98%), linear-gradient(to bottom, #fff, #fff)',
        },
        [DonutKey.UNTRAINED]: {
          label: 'Untrained',
          gradient: 'linear-gradient(to bottom, rgba(241, 70, 123, 0.12), rgba(241, 70, 123, 0.24)), linear-gradient(to bottom, #fff, #fff)',
        },
      }}
      renderTooltip={({ key, value, slots, intents }) => (
        <Box minWidth="200px">
          <BlockText fontSize={13} mb={12}>
            {key === DonutKey.TRAINED ? 'Last Trained' : 'Since Last Trained'}: <Duration time={lastTrainedTime} color="#62778c" />
          </BlockText>

          <Flex>
            <Box flex={1} mb={12}>
              Intents
            </Box>
            <Box>{intents}</Box>
          </Flex>

          <Flex>
            <Box flex={1} mb={12}>
              Slots
            </Box>
            <Box>{slots}</Box>
          </Flex>

          <Flex>
            <Box flex={1} mb={12} color="#132144">
              {`Total ${key === DonutKey.TRAINED ? 'Trained' : 'Untrained'}`}
            </Box>
            <Box>{value}</Box>
          </Flex>
        </Box>
      )}
    />
  );
};

export default ModelState;
