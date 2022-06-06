import { Box, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import VariableSelectV2 from '@/components/VariableSelectV2';
import VariablesInput from '@/components/VariablesInput';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

interface SetItemProps {
  id: number;
}

const SetItem: React.FC<SetItemProps> = ({ id }) => {
  // to do: remove it
  const [expression, setExpression] = React.useState('');
  const [selectedVariable, setSelectedVariable] = React.useState<string>();

  return (
    <EditorV2.PersistCollapse namespace={['SetSection', id.toString()]} defaultCollapsed={false}>
      {({ collapsed, onToggle }) => (
        <SectionV2.Sticky disabled={collapsed}>
          {({ sticked }) => (
            <SectionV2.CollapseSection
              header={
                <SectionV2.Header sticky sticked={sticked && !collapsed}>
                  <SectionV2.Title bold={!collapsed}>Set variable {id}</SectionV2.Title>

                  <SectionV2.CollapseArrowIcon collapsed={collapsed} />
                </SectionV2.Header>
              }
              onToggle={onToggle}
              collapsed={collapsed}
              containerToggle
            >
              <SectionV2.Content bottomOffset={2.5}>
                <VariableSelectV2 value={selectedVariable} prefix="APPLY TO" onChange={setSelectedVariable} placeholder="Select variable" />

                <Box mt="16px">
                  <VariablesInput
                    placeholder="Enter value, {variable} or expression"
                    error={false}
                    onFocus={() => {}}
                    value={String(expression)}
                    onBlur={({ text }) => setExpression(text)}
                    multiline
                  />
                </Box>
              </SectionV2.Content>
            </SectionV2.CollapseSection>
          )}
        </SectionV2.Sticky>
      )}
    </EditorV2.PersistCollapse>
  );
};

export default SetItem;
