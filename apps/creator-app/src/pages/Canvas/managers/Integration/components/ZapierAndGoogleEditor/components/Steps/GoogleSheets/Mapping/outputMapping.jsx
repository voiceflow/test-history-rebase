import { Button, ButtonVariant, SVG, SvgIcon } from '@voiceflow/ui';
import React from 'react';
import Select from 'react-select';

import VariableSelect from '@/components/VariableSelect';
import { styled } from '@/hocs/styled';

const MapLine = styled.div`
  margin-bottom: 6px;
`;

const StyledSvgIcon = styled(SvgIcon)`
  cursor: pointer;
  color: #8da2b570;

  &:hover {
    color: #8da2b5;
  }
`;

const OutputMapping = (props) => (
  <>
    {props.arguments.map((argument, i) => (
      <MapLine key={i} className="d-flex align-items-center">
        <div className="flex-1">
          <Select
            classNamePrefix="select-box"
            className="integrations-output-box"
            value={argument.arg1 || null}
            onChange={(selected) => props.handleSelection(i, 'arg1', selected)}
            placeholder="Column"
            options={Array.isArray(props.arg1_options) ? props.arg1_options : null}
          />
        </div>
        <SvgIcon icon="arrowRight" variant={SvgIcon.Variant.TERTIARY} size={12} mx="xs" />
        <div className="flex-1">
          <VariableSelect
            value={argument.arg2 ? argument.arg2 : null}
            onChange={(value) => props.handleSelection(i, 'arg2', value)}
            placeholder="Variable"
          />
        </div>
        <StyledSvgIcon icon={SVG.close} size={12} onClick={() => props.onRemove(i)} ml="xs" />
      </MapLine>
    ))}
    <Button variant={ButtonVariant.SECONDARY} className="margin-auto" onClick={props.onAdd}>
      + Add Mapping
    </Button>
  </>
);

export default OutputMapping;
