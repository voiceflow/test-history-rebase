import './menu.css';

import React, { useState } from 'react';
import { Form, Input } from 'reactstrap';

import DATA from './data';

function Prompt(props) {
  const { options, prompt, data, onClick } = props;
  const { placeholder, attribute } = prompt;
  const [input, setInput] = useState('');

  const submit = (e) => {
    e.preventDefault();
    onClick({ ...data, [attribute]: input, VF_path: [...data.VF_path, input], VF_custom: true });
    setInput('');
  };

  return (
    <div className="prompt">
      <Form onSubmit={submit}>
        <Input placeholder={placeholder} value={input} onChange={(e) => setInput(e.target.value)} />
      </Form>
      {options.length > 0 && <hr />}
      {options.length > 0 &&
        options
          .map((option, i) => (
            <span key={i} className="option" onClick={() => onClick({ ...data, ...option.data, VF_path: [...data.VF_path, option.name] })}>
              {option.name}
            </span>
          ))
          .reduce((a, b) => [...a, ' | ', b], [])
          .slice(1)}
    </div>
  );
}

function SubMenu(props) {
  const { options, data: pdata, onClick } = props;
  const { name, children, prompt, data: odata } = options;
  const data = { ...pdata, ...odata, VF_path: [...pdata.VF_path, name] };
  const canClick = () => {
    if (!prompt && children.length === 0) onClick(data);
  };
  return (
    <span className="item" onClick={canClick}>
      {name}
      {prompt ? (
        <Prompt options={children} prompt={prompt} data={data} onClick={onClick} />
      ) : (
        <span className="menu">
          {children.map((val, i) => (
            <SubMenu key={i} options={val} data={data} onClick={onClick} />
          ))}
        </span>
      )}
    </span>
  );
}

function Menu(props) {
  const { onClick, className } = props;
  return (
    <div className={`d-inline-block ${className}`}>
      <span className="menu">
        <span className="item">
          EFFECT
          <span className="menu">
            <Input placeholder="Search" />
            {DATA.children.map((val, i) => (
              <SubMenu key={i} options={val} data={{ VF_path: [] }} onClick={onClick} />
            ))}
          </span>
        </span>
      </span>
    </div>
  );
}

export default Menu;
