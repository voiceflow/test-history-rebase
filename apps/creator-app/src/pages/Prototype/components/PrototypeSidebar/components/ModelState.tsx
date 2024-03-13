import { BlockText, Box, Flex } from '@voiceflow/ui';
import React from 'react';

import DonutChart from '@/components/DonutChart';
import Duration from '@/components/Duration';

interface ModelStateProps {
  nluTrainingDiffData: {
    trainedCount: number;
    untrainedCount: number;
    lastTrainedTime: number | null;
    trainedSlotsCount: number;
    trainedIntentsCount: number;
    untrainedSlotsCount: number;
    untrainedIntentsCount: number;
  };
}

const DonutKey = {
  TRAINED: 'TRAINED',
  UNTRAINED: 'UNTRAINED',
} as const;

const ModelState: React.FC<ModelStateProps> = ({ nluTrainingDiffData }) => {
  return (
    <DonutChart
      size={120}
      data={[
        {
          key: DonutKey.TRAINED,
          color: '#5d9df5',
          value: nluTrainingDiffData.trainedCount,
          slots: nluTrainingDiffData.trainedSlotsCount,
          intents: nluTrainingDiffData.trainedIntentsCount,
        },
        {
          key: DonutKey.UNTRAINED,
          color: '#f1467b',
          value: nluTrainingDiffData.untrainedCount,
          slots: nluTrainingDiffData.untrainedSlotsCount,
          intents: nluTrainingDiffData.untrainedIntentsCount,
        },
      ]}
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
          {!!nluTrainingDiffData.lastTrainedTime && (
            <BlockText fontSize={13} mb={12}>
              {key === DonutKey.TRAINED ? 'Last Trained' : 'Since Last Trained'}:{' '}
              <Duration time={nluTrainingDiffData.lastTrainedTime} color="#62778c" />
            </BlockText>
          )}

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

export default React.memo(ModelState);
