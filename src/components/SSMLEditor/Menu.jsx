/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable no-nested-ternary */
import './menu.css';

import SvgIcon from 'components/SvgIcon';
import React, { useState } from 'react';
import { Form, Input } from 'reactstrap';
import styled from 'styled-components';
import ArrowRight from 'svgs/arrow-right.svg';
import CaretDown from 'svgs/toggle.svg';

import DATA from './data';

const Options = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  justify-content: space-evenly;
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
  const { placeholder, attribute } = prompt;
  const [input, setInput] = useState('');
  const [focus, changeFocus] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    onClick({ ...data, [attribute]: input, VF_path: [...data.VF_path, input], VF_custom: true });
    setInput('');
  };

  return (
    <div className="prompt">
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
              <span key={i} className="option" onClick={() => onClick({ ...data, ...option.data, VF_path: [...data.VF_path, option.name] })}>
                {option.name}
              </span>
            ))
            .reduce((a, b) => [...a, ' | ', b], [])
            .slice(1)}
      </Options>
    </div>
  );
}

function SubMenu(props) {
  const { options, data: pdata, onClick, depth = 0, onMouseOver, onMouseLeave, hover } = props;
  const { name, children, prompt, data: odata } = options;
  const data = { ...pdata, ...odata, VF_path: [...pdata.VF_path, name] };
  const canClick = () => {
    if (!prompt && children.length === 0) onClick(data);
  };

  return (
    <div className={depth === 0 ? 'add-effect' : 'effect'} onClick={canClick} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
      <div className={depth === 0 ? (hover ? 'add-effect-hover' : 'add-effect-name') : ''}>{name}</div>
      {depth === 0 ? (
        <SvgIcon style={{ marginLeft: '10px', marginTop: '5px' }} color={hover ? '#5d9df5' : '#6E849A'} icon={CaretDown} height={10} width={10} />
      ) : children.length ? (
        <SvgIcon className="arrow-right" style={{ marginRight: '15px' }} icon={ArrowRight} height={7} width={7} />
      ) : null}
      {prompt ? (
        <Prompt options={children} prompt={prompt} data={data} onClick={onClick} />
      ) : (
        <div className="menu">
          {children.map((val, i) => (
            <SubMenu onMouseOver={onMouseOver} onMouseLeave={onMouseOver} key={i} depth={depth + 1} options={val} data={data} onClick={onClick} />
          ))}
        </div>
      )}
    </div>
  );
}

function Menu(props) {
  const { onClick } = props;
  const [hover, changeHover] = useState(false);
  return (
    <SubMenu
      hover={hover}
      onMouseOver={() => changeHover(true)}
      onMouseLeave={() => changeHover(false)}
      options={DATA}
      data={{ VF_path: [] }}
      onClick={onClick}
    />
  );
}

export default Menu;
