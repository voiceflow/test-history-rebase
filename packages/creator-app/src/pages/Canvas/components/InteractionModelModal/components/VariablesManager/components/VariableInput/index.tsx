import { Badge, Dropdown, Flex, FlexApart, Input, KeyName, SvgIcon, toast } from '@voiceflow/ui';
import React from 'react';

import InfoIcon from '@/components/InfoIcon';
import * as Diagram from '@/ducks/diagram';
import * as Session from '@/ducks/session';
import * as Version from '@/ducks/version';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';
import { withKeyPress } from '@/utils/dom';

import { VariableType } from '../../constants';
import { Container, Info, Label, Select } from './components';

const VARIABLE_LABELS: Record<VariableType, string> = {
  [VariableType.LOCAL]: 'Flow',
  [VariableType.GLOBAL]: 'Global',
  [VariableType.BUILT_IN]: 'Built In',
};

export interface VariableInputProps {
  setSelected: (type: VariableType, variable: string) => void;
  children?: never;
}

const VariableInput: React.FC<VariableInputProps & ConnectedVariableInputProps> = ({
  addGlobalVariable,
  addLocalVariable,
  setSelected,
  ...props
}) => {
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
        await addLocalVariable(value);
      } else {
        await addGlobalVariable(value);
      }

      setSelected(variableType, value);
      setValue('');
    } catch (err) {
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
        onChange={({ target }) => setValue(target.value)}
        {...props}
        maxLength={64}
        rightAction={
          !!value.length && (
            <Badge slide onClick={onAdd}>
              Enter
            </Badge>
          )
        }
        onKeyPress={withKeyPress(KeyName.ENTER, onAdd)}
        nested
      />
    </Container>
  );
};

const mapStateToProps = {
  diagramID: Session.activeDiagramIDSelector,
};

const mapDispatchToProps = {
  addGlobalVariable: Version.addGlobalVariable,
  addLocalVariable: Diagram.addActiveDiagramVariable,
};

type ConnectedVariableInputProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(VariableInput) as React.FC<VariableInputProps>;
