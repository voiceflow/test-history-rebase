import { constants } from '@voiceflow/common';
import React from 'react';
import Select from 'react-select';
import styled from 'styled-components';

const StyledSelect = styled(Select)`
  width: 87px;
  & > .css-bg1rzq-control {
    border: 1px transparent !important;
    box-shadow: none !important;
  }

  & > .select-box {
    border: 1px transparent !important;
  }

  & > .select-box__control {
    box-shadow: none !important;
  }

  & > .select-box__control--is-focused {
    border-color: transparent !important;
  }

  & > .css-kj6f9i-menu {
    width: 125px !important;
  }
`;

const VOICES = constants.voices;

function Voice(props) {
  const { voice, onChange } = props;
  return (
    <StyledSelect
      className="speak-box"
      classNamePrefix="select-box"
      value={{ label: voice, value: voice }}
      onChange={(selected) => onChange(selected.value)}
      options={VOICES}
    />
  );
}

export default React.memo(Voice);
