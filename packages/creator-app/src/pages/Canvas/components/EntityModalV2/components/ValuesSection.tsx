import { Badge, Box, Input, stopPropagation, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import ListManagerWrapper from '@/components/IntentForm/components/ListManagerWrapper';
import ListManager from '@/components/ListManager';
import Section, { SectionVariant } from '@/components/Section';
import { FormControl } from '@/pages/Canvas/components/Editor';

const ValuesSection: React.FC = () => {
  const valueRef = React.useRef<HTMLInputElement | null>(null);
  const [values, setValues] = React.useState<any[]>([]);

  const handleValueImport = () => {};

  const onHandleSlotsUpdate = (items: any[]) => {
    setValues(items);
  };

  return (
    <Section
      infix={
        <TippyTooltip title="Bulk Import">
          <SvgIcon icon="upload" clickable onClick={stopPropagation(handleValueImport)} />
        </TippyTooltip>
      }
      header="Values"
      variant={SectionVariant.QUATERNARY}
      forceDividers
    >
      <Box>
        <FormControl>
          <ListManagerWrapper>
            <ListManager
              items={values}
              addToStart
              renderForm={({ value, onChange, onAdd }) => (
                <Input
                  ref={valueRef}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onEnterPress={() => onAdd(value)}
                  placeholder="Value: synonym, synonym 2..."
                  rightAction={
                    value && (
                      <Badge slide onClick={() => onAdd(value)}>
                        Enter
                      </Badge>
                    )
                  }
                />
              )}
              onUpdate={onHandleSlotsUpdate}
              renderItem={() => <Box>BMW Add synonyms</Box>}
            />
          </ListManagerWrapper>
        </FormControl>
      </Box>
    </Section>
  );
};

export default ValuesSection;
