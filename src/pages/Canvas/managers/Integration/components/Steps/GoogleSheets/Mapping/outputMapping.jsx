import React from 'react';
import Select from 'react-select';

import Button from '@/components/LegacyButton';
import SvgIcon, { IconVariant } from '@/components/SvgIcon';
import VariableSelect from '@/components/VariableSelect';
import { styled } from '@/hocs';

const MapLine = styled.div`
  margin-bottom: 6px;
`;

const OutputMapping = (props) => (
  <>
    {props.arguments.map((argument, i) => {
      return (
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
          <SvgIcon icon="arrowRight" variant={IconVariant.TERTIARY} size={12} mx="xs" />
          <div className="flex-1">
            <VariableSelect
              value={argument.arg2 ? argument.arg2 : null}
              onChange={(value) => props.handleSelection(i, 'arg2', value)}
              placeholder="Variable"
            />
          </div>
          <Button isCloseSmall className="ml-2" onClick={() => props.onRemove(i)} />
        </MapLine>
      );
    })}
    <Button isBtn isClear isLarge isBlock onClick={props.onAdd}>
      + Add Mapping
    </Button>
  </>
);

export default OutputMapping;
