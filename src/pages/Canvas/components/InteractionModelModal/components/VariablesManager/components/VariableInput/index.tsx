import React from 'react';

import Badge from '@/components/Badge';
import Dropdown from '@/components/Dropdown';
import Flex, { FlexApart } from '@/components/Flex';
import InfoIcon from '@/components/InfoIcon';
import Input from '@/components/Input';
import SvgIcon from '@/components/SvgIcon';
import { toast } from '@/components/Toast';
import * as Diagram from '@/ducks/diagram';
import * as Session from '@/ducks/session';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { Thunk } from '@/store/types';
import { ConnectedProps, MergeArguments } from '@/types';
import { withKeyPress } from '@/utils/dom';

import { VariableType } from '../../constants';
import { Container, Info, Label, Select } from './components';

const VARIABLE_LABELS: Record<VariableType, string> = {
  [VariableType.LOCAL]: 'Flow',
  [VariableType.GLOBAL]: 'Global',
  [VariableType.BUILT_IN]: 'Built In',
};

export type VariableInputProps = {
  setSelected: (type: VariableType, variable: string) => void;
  children?: never;
};

const VariableInput: React.FC<VariableInputProps & ConnectedVariableInputProps> = ({ addVariable, addFlowVariable, setSelected, ...props }) => {
  const [value, setValue] = React.useState('');
  const [variableType, setVariableType] = React.useState<VariableType>(VariableType.GLOBAL);

  const isFlow = variableType === VariableType.LOCAL;

  const menuOptions = React.useMemo(
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

  const onAdd = React.useCallback(async () => {
    if (!value.trim()) return;
    try {
      if (isFlow) {
        await addFlowVariable(value);
      } else {
        addVariable(value);
      }

      setSelected(variableType, value);
      setValue('');
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
        <Dropdown options={menuOptions}>
          {(ref, onToggle, isOpen) => (
            <Select ref={ref} onClick={onToggle} active={isOpen}>
              {VARIABLE_LABELS[variableType]} <SvgIcon icon="caretDown" size={8} />
            </Select>
          )}
        </Dropdown>
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
  diagramID: Session.activeDiagramIDSelector,
};

const mapDispatchToProps = {
  addVariable: Skill.addGlobalVariable as (variable: string) => Thunk,
  addFlowVariable: Diagram.addDiagramVariable,
};

const mergeProps = (...[{ diagramID }, { addFlowVariable }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps>) => ({
  addFlowVariable: (variable: string) => addFlowVariable(diagramID!, variable),
});

type ConnectedVariableInputProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(VariableInput) as React.FC<VariableInputProps>;
