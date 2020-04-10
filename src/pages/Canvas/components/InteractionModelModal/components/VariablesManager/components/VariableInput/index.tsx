import React from 'react';

import Badge from '@/components/Badge';
import Dropdown from '@/components/Dropdown';
import Flex, { FlexApart } from '@/components/Flex';
import InfoIcon from '@/components/InfoIcon';
import Input from '@/components/Input';
import SvgIcon from '@/components/SvgIcon';
import { toast } from '@/components/Toast';
import * as Skill from '@/ducks/skill';
import * as VariableSet from '@/ducks/variableSet';
import { connect } from '@/hocs';
import { withKeyPress } from '@/utils/dom';

import { VariableType } from '../../constants';
import { Container, Info, Label, Select } from './components';

type VariableInputProps = {
  setSelected: (type: VariableType, variable: string) => void;
  addVariable: (variable: string) => void;
  addFlowVariable: (variable: string) => void;
};

const VARIABLE_LABELS: Record<VariableType, string> = {
  [VariableType.LOCAL]: 'Flow',
  [VariableType.GLOBAL]: 'Global',
  [VariableType.BUILT_IN]: 'Built In',
};

const VariableInput: React.FC<VariableInputProps> = ({ addVariable, addFlowVariable, setSelected, ...props }) => {
  const [value, setValue] = React.useState('');
  const [variableType, setVariableType] = React.useState<VariableType>(VariableType.GLOBAL);

  const isFlow = variableType === VariableType.LOCAL;

  const MenuOptions = React.useMemo(
    () => [
      {
        label: VARIABLE_LABELS[VariableType.GLOBAL],
        onClick: () => setVariableType(VariableType.GLOBAL),
      },
      {
        label: VARIABLE_LABELS[VariableType.LOCAL],
        onClick: () => setVariableType(VariableType.LOCAL),
      },
    ],
    []
  );

  const onAdd = React.useCallback(() => {
    if (!value.trim()) return;
    try {
      if (isFlow) {
        addFlowVariable(value);
      } else {
        addVariable(value);
      }

      setSelected(variableType, value);
      setValue('');
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      toast.error(err.message);
    }
  }, [value, isFlow]);

  return (
    <Container>
      <FlexApart style={{ marginBottom: 8, alignItems: 'flex-end' }}>
        <Flex>
          <Label>Add Variable</Label>
          <InfoIcon>{Info}</InfoIcon>
        </Flex>
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          <Dropdown options={MenuOptions}>
            {(ref: any, onToggle: any, isOpen: boolean) => (
              <Select ref={ref} onClick={onToggle} active={isOpen}>
                {VARIABLE_LABELS[variableType]} <SvgIcon icon="caretDown" size={8} />
              </Select>
            )}
          </Dropdown>
        }
      </FlexApart>
      <Input
        placeholder={`Add ${VARIABLE_LABELS[variableType]} Variable`}
        value={value}
        onChange={(e: any) => setValue(e.target.value)}
        {...props}
        maxLength={16}
        rightAction={
          !!value.length && (
            <Badge slide onClick={onAdd}>
              Enter
            </Badge>
          )
        }
        onKeyPress={withKeyPress(13, onAdd)}
        nested
      />
    </Container>
  );
};

const mapStateToProps = {
  diagramID: Skill.activeDiagramIDSelector,
};

const mapDispatchToProps = {
  addVariable: Skill.addGlobalVariable,
  addFlowVariable: VariableSet.addVariableToDiagramAndSave,
};

const mergeProps = ({ diagramID }: { diagramID: string }, { addFlowVariable }: typeof mapDispatchToProps) => ({
  addFlowVariable: (variable: string) => addFlowVariable(diagramID, variable),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(VariableInput);
