import { Box, Flex, OverflowText, SvgIcon, Text, TippyTooltip } from '@voiceflow/ui';
import pluralize from 'pluralize';
import React from 'react';

export interface ErrorsProps {
  name: string;
  errors: Map<number, string>;
}

const Errors: React.FC<ErrorsProps> = ({ name, errors }) => (
  <Flex>
    <Box mr={12}>
      <SvgIcon icon="error" size={16} color="#d94c4c" />
    </Box>

    <OverflowText>
      <Text>
        {errors.size} invalid {pluralize(name, errors.size)}{' '}
        <Text color="#62778c">
          ({pluralize('row', errors.size)}:{' '}
          {[...errors.entries()].map((error, index, arr) => (
            <React.Fragment key={error[0]}>
              <TippyTooltip content={error[1]}>
                <Text color="#62778c">{error[0] + 1}</Text>
              </TippyTooltip>
              {arr.length !== index + 1 ? ', ' : ''}
            </React.Fragment>
          ))}
          )
        </Text>
      </Text>
    </OverflowText>
  </Flex>
);

export default Errors;
