import { ExpressionV2 } from '@voiceflow/general-types';
import React from 'react';

import AceEditor from '@/components/AceEditor';
import Box, { Flex } from '@/components/Box';
import Dropdown from '@/components/Dropdown';
import Label from '@/components/Label';
import { MenuContainer } from '@/components/Menu';
import SvgIcon from '@/components/SvgIcon';
import Text from '@/components/Text';
import { useEnableDisable } from '@/hooks';

import { SupportedOperations } from '../constants';
import { isValidExpression } from '../utils';
import ListItem from './ListItem';

export type ConditionExpressionProps = {
  expression: ExpressionV2;
  onChange: (value: ExpressionV2) => void;
  onDelete: () => void;
};

const ConditionExpression: React.FC<ConditionExpressionProps> = ({ expression, onChange, onDelete }) => {
  const [error, setError, resetError] = useEnableDisable(false);

  const onUpdate = (value: string) => {
    if (!value) return;

    if (!isValidExpression()) {
      setError();
    }
    onChange({ ...expression, value } as ExpressionV2);
    resetError();
  };

  return (
    <Box mb={16}>
      <Box mb={11}>
        <Flex>
          <Label inline>Expression</Label>
          <Dropdown
            placement="auto"
            menu={() => (
              <MenuContainer padding="24px 32px" height={348}>
                <Text>{`This input accepts plain text numbers, variables using "{" and methamatical expressions.`}</Text>
                <Box mt={16} mb={16}>
                  <Text fontWeight={600}>The following math operations are supported:</Text>
                  <Box mt={8} color="#62778c">
                    {SupportedOperations.map(({ label, icon }, index) => (
                      <ListItem key={index}>
                        <Flex mb={6}>
                          <Text fontWeight={600} color="#131244">
                            {icon}
                          </Text>
                          <Text>{label}</Text>
                        </Flex>
                      </ListItem>
                    ))}
                  </Box>
                </Box>
                <Box fontWeight={600} mb={8}>
                  Expression Example
                </Box>
                <Text>{'{level} =/= {score}'}</Text>
              </MenuContainer>
            )}
          >
            {(ref, onToggle, isOpen) => (
              <Box ml={8} ref={ref} onClick={onToggle}>
                <SvgIcon icon="info" size={14} color={isOpen ? '#3d82e2' : '#becedc'} clickable />
              </Box>
            )}
          </Dropdown>
        </Flex>
      </Box>

      <Flex>
        <Flex flex={1}>
          <AceEditor value={expression.value as string} onChange={onUpdate} />
        </Flex>
        <Flex ml={16} onClick={onDelete}>
          <SvgIcon icon="remove" color="#6e849a" clickable />
        </Flex>
      </Flex>

      {error && (
        <Box fontSize={13} color="#e91e63" mt={16}>
          Expression is invalid.
        </Box>
      )}
    </Box>
  );
};

export default ConditionExpression;
