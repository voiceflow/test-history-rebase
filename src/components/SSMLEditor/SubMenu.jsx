import React from 'react';

import ArrowRight from '@/svgs/arrow-right.svg';

import Effect from './Effect';
import Prompt from './Prompt';
import RightArrow from './RightArrow';
import SubMenuContainer from './SubMenuContainer';

function SubMenu(props) {
  const { options, data: pdata, onClick } = props;
  const { name, children, prompt, data: odata } = options;
  const data = { ...pdata, ...odata, VF_path: [...pdata.VF_path, name] };
  const canClick = () => {
    if (!prompt && children.length === 0) onClick(data);
  };
  return (
    <Effect onClick={canClick}>
      {name}
      {children.length ? <RightArrow icon={ArrowRight} height={7} width={7} /> : null}
      {prompt ? (
        <Prompt options={children} prompt={prompt} data={data} onClick={onClick} />
      ) : (
        <SubMenuContainer>
          {children.map((val, i) => (
            <SubMenu key={i} options={val} data={data} onClick={onClick} />
          ))}
        </SubMenuContainer>
      )}
    </Effect>
  );
}

export default SubMenu;
