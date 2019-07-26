import React, { useState } from 'react';
import { Tooltip } from 'react-tippy';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import styled from 'styled-components';

import SvgIcon from '@/components/SvgIcon';
import Clock from '@/svgs/clock.svg';

import { makeDescription } from './tagUtil';

const RecentButton = styled(DropdownToggle)`
  padding: 0px 0px 0px 0px;
  margin: 0px 25px 0px 0px;
  border: none !important;
  background: #fff !important;
  border-color: #fff !important;
`;

function Recent(props) {
  const { history, onClick } = props;
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Dropdown isOpen={open} toggle={() => setOpen(!open)}>
        <RecentButton>
          <Tooltip title="Recent Effects" position="top">
            <SvgIcon icon={Clock} />
          </Tooltip>
        </RecentButton>
        {history.length === 0 ? null : (
          <DropdownMenu>
            {history.map((val, i) => (
              <DropdownItem key={i} onClick={() => onClick(val, true)}>
                {makeDescription(val)}
              </DropdownItem>
            ))}
          </DropdownMenu>
        )}
      </Dropdown>
    </div>
  );
}

export default React.memo(Recent);
