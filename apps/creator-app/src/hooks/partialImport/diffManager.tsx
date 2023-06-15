import { Box, Text, ThemeColor } from '@voiceflow/ui';
import { produce } from 'immer';
import React from 'react';

import * as Domain from '@/ducks/domain';
import { useSelector } from '@/hooks/redux';

import { VFDiff } from './diff';
import DiffItem from './diffItem';

interface DiffManagerProps {
  diff: VFDiff;
  setDiff: React.Dispatch<React.SetStateAction<VFDiff | null>>;
}

const DiffManager: React.FC<DiffManagerProps> = ({ diff, setDiff }) => {
  const targetDomain = useSelector(Domain.active.domainSelector);

  const toggleDiff = React.useCallback(
    (resource: keyof VFDiff['diff'], index: number) => () => {
      setDiff((prev) =>
        produce(prev, (draft) => {
          if (!draft) return;
          draft.diff[resource][index].useNext = !draft.diff[resource][index].useNext;
        })
      );
    },
    []
  );

  return (
    <>
      <Box>
        <Box.FlexApart mb={11} fontWeight={600}>
          Intents
          <Box fontSize={13} color={ThemeColor.SECONDARY}>
            Current | Imported
          </Box>
        </Box.FlexApart>
        {diff.diff.intents.map((intent, index) => (
          <DiffItem key={intent.nextResource.key} diff={intent} toggleDiff={toggleDiff('intents', index)} />
        ))}
      </Box>
      <Box>
        <hr />
        <Box.FlexApart mb={11} fontWeight={600}>
          Entities
          <Box fontSize={13} color={ThemeColor.SECONDARY}>
            Current | Imported
          </Box>
        </Box.FlexApart>
        {diff.diff.entities.map((entity, index) => (
          <DiffItem key={entity.nextResource.key} diff={entity} toggleDiff={toggleDiff('entities', index)} />
        ))}
      </Box>
      <Box>
        <hr />
        <Box.FlexApart mb={11} fontWeight={600}>
          <Box>
            Topics&nbsp;&nbsp;
            <Text fontSize={13} fontWeight={400}>
              (merging into <b>{targetDomain?.name}</b> domain)
            </Text>
          </Box>
          <Box fontSize={13} color={ThemeColor.SECONDARY}>
            Current | Imported
          </Box>
        </Box.FlexApart>
        {diff.diff.topics.map((topic, index) => (
          <DiffItem
            key={topic.nextResource._id}
            diff={topic}
            toggleDiff={toggleDiff('topics', index)}
            name={topic.nextResource.name === 'ROOT' ? 'Home' : undefined}
          />
        ))}
      </Box>
      <Box>
        <hr />
        <Box.FlexApart mb={11} fontWeight={600}>
          Components
          <Box fontSize={13} color={ThemeColor.SECONDARY}>
            Current | Imported
          </Box>
        </Box.FlexApart>
        {diff.diff.components.map((component, index) => (
          <DiffItem key={component.nextResource._id} diff={component} toggleDiff={toggleDiff('components', index)} />
        ))}
      </Box>
      {diff.diff.customBlocks.length && (
        <Box>
          <hr />
          <Box.FlexApart mb={11} fontWeight={600}>
            Custom Blocks
            <Box fontSize={13} color={ThemeColor.SECONDARY}>
              Current | Imported
            </Box>
          </Box.FlexApart>
          {diff.diff.customBlocks.map((component, index) => (
            <DiffItem key={component.nextResource.key} diff={component} toggleDiff={toggleDiff('customBlocks', index)} />
          ))}
        </Box>
      )}
    </>
  );
};

export default DiffManager;
