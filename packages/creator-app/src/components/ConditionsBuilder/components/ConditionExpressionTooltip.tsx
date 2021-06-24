import { Box, BoxFlex, Text } from '@voiceflow/ui';
import React from 'react';

import ListItem from '@/components/ConditionsBuilder/components/ListItem';
import { SupportedOperations } from '@/components/ConditionsBuilder/constants';
import InfoIcon from '@/components/InfoIcon';

const ConditionExpressionTooltip: React.FC = () => (
  <InfoIcon tooltipProps={{ helpMessage: false, helpTitle: false }}>
    <>
      <Text>{`This input accepts plain text numbers, variables using "{" and methamatical expressions.`}</Text>
      <Box mt={16} mb={16}>
        <Text fontWeight={600}>The following math operations are supported:</Text>
        <Box mt={8} color="#62778c">
          {SupportedOperations.map(({ label, icon }, index) => (
            <ListItem key={index}>
              <BoxFlex mb={6}>
                <Text fontWeight={600} color="#131244">
                  {icon}
                </Text>
                <Text>{label}</Text>
              </BoxFlex>
            </ListItem>
          ))}
        </Box>
      </Box>
      <Box fontWeight={600} mb={8}>
        Expression Example
      </Box>
      <Text>{'{level} =/= {score}'}</Text>
    </>
  </InfoIcon>
);

export default ConditionExpressionTooltip;
