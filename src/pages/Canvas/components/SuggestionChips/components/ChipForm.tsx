import { Chip } from '@voiceflow/general-types';
import React from 'react';
import { createSelector } from 'reselect';

import Box from '@/components/Box';
import ListManagerWrapper from '@/components/IntentForm/components/ListManagerWrapper';
import ListManager from '@/components/ListManager';
import Section from '@/components/Section';
import _VariablesInput from '@/components/VariablesInput';
import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { useUpdateData } from '@/pages/Canvas/components/EditorSidebar/hooks';
import { ConnectedProps } from '@/types';

import InfoTooltip from './InfoTooltip';

const VariablesInput = _VariablesInput as any;
type V = { text: string };
const variableInputToChip = (updateFn: (c: Chip) => void) => ({ text }: V) => updateFn({ label: text });

const focusedNodeChipsSelector = createSelector(Creator.focusedNodeDataSelector, (data) => (data as { chips?: { label: string }[] })?.chips);

const ChipForm: React.FC<ConnectedChipFormProps> = ({ focus, chips }) => {
  const inputRef = React.useRef();
  const updateData = useUpdateData(focus.target || undefined);
  const updateChips = React.useCallback((chips) => updateData({ chips }), [updateData]);

  if (!chips) return null;

  return (
    <Section>
      <FormControl label="Chips" tooltip={<InfoTooltip />}>
        <ListManagerWrapper>
          <ListManager
            items={chips}
            addToStart
            beforeAdd={() => (inputRef as any).current.forceUpdate()}
            renderForm={({ value, onAdd, onChange }) => (
              <VariablesInput
                ref={inputRef}
                placeholder="Add suggestion chip"
                value={value?.label}
                onBlur={variableInputToChip(onChange)}
                onEnterPress={variableInputToChip(onAdd)}
              />
            )}
            onUpdate={updateChips}
            renderItem={(item, { onUpdate }) => (
              <Box width="100%">
                <VariablesInput
                  placeholder="Update suggestion chip"
                  value={item.label}
                  onBlur={variableInputToChip(onUpdate)}
                  onEnterPress={onUpdate}
                  creatable={false}
                />
              </Box>
            )}
          />
        </ListManagerWrapper>
      </FormControl>
    </Section>
  );
};

const mapStateToProps = {
  focus: Creator.creatorFocusSelector,
  chips: focusedNodeChipsSelector,
};

type ConnectedChipFormProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(ChipForm);
