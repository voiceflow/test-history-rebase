import React, { useState } from 'react';
import { Form, Input } from 'reactstrap';
import styled from 'styled-components';

import { PromptContainer } from './Menu';

const Options = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  justify-content: space-evenly;
`;

const Option = styled.span`
  color: #5d9df5;
`;

const Label = styled.div`
  align-self: flex-start;
  font-size: 13px;
  color: #62778c;
  margin-top: 8px;
`;

const Divider = styled.hr`
  margin-top: 10px;
  margin-bottom: 0px;
`;

function Prompt(props) {
  const { options, prompt, data, onClick } = props;
  // default format is to do nothing
  const { placeholder, attribute, format } = prompt;
  const [input, setInput] = useState('');
  const [focus, changeFocus] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    let value = input;
    if (typeof format === 'function') value = format(value);
    onClick({ ...data, [attribute]: value, VF_path: [...data.VF_path, value], VF_custom: true });
    setInput('');
  };

  return (
    <PromptContainer>
      <Form onSubmit={submit}>
        <Input
          placeholder={placeholder}
          onFocus={() => changeFocus(true)}
          onBlur={() => changeFocus(false)}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </Form>
      {focus ? <Label>Press "Enter" to add</Label> : null}
      {options.length > 0 && <Divider />}
      <Options>
        {options.length > 0 &&
          options
            .map((option, i) => (
              <Option key={i} onClick={() => onClick({ ...data, ...option.data, VF_path: [...data.VF_path, option.name] })}>
                {option.name}
              </Option>
            ))
            .reduce((a, b) => [...a, ' | ', b], [])
            .slice(1)}
      </Options>
    </PromptContainer>
  );
}

export default Prompt;
