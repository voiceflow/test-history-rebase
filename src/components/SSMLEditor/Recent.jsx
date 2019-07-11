import React, { useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

import { makeDescription } from './tagUtil';

function Recent(props) {
  const { history, onClick, className } = props;
  const [open, setOpen] = useState(false);
  return (
    <div className={`d-inline-block ${className}`}>
      <Dropdown isOpen={open} toggle={() => setOpen(!open)}>
        <DropdownToggle>RECENT</DropdownToggle>
        <DropdownMenu>
          {history.map((val, i) => (
            <DropdownItem key={i} onClick={() => onClick(val, true)}>
              {makeDescription(val)}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

export default React.memo(Recent);
