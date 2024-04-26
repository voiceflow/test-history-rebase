import { Box, Text, TutorialInfoIcon } from '@voiceflow/ui';
import React from 'react';

import ListItem from '@/components/ConditionsBuilder/components/ListItem';
import { SupportedOperations } from '@/components/ConditionsBuilder/constants';

const ConditionExpressionTooltip: React.FC = () => (
  <TutorialInfoIcon>
    <Text>{'This input accepts plain text numbers, variables using "{" and mathematical expressions.'}</Text>

    <Box mt={16} mb={16}>
      <Text fontWeight={600}>The following math operations are supported:</Text>
      <Box mt={8} color="#62778c">
        {SupportedOperations.map(({ label, icon }, index) => (
          <ListItem key={index}>
            <Box.Flex mb={6}>
              <Text fontWeight={600} color="#131244">
                {icon}
              </Text>
              <Text>{label}</Text>
            </Box.Flex>
          </ListItem>
        ))}
      </Box>
    </Box>

    <Box fontWeight={600} mb={8}>
      Expression Example
    </Box>

    <Text>{'{level} =/= {score}'}</Text>
  </TutorialInfoIcon>
);

export default ConditionExpressionTooltip;
