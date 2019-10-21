import cn from 'classnames';
import React from 'react';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';

import { ExpressionType } from '@/constants';
import { useToggle } from '@/hooks/toggle';

import { GROUPS, SYMBOLS } from '../constants';

function OperatorDropdown({ depth, children, update, className }) {
  const [open, toggleOpen] = useToggle(false);

  const menuGroups = depth === 8 ? [[ExpressionType.VALUE, ExpressionType.VARIABLE], [ExpressionType.ADVANCE]] : GROUPS;

  return (
    <Dropdown isOpen={open} toggle={toggleOpen}>
      <DropdownToggle tag="div" className={className}>
        {children}
      </DropdownToggle>
      <DropdownMenu className="expression-menu">
        {menuGroups.map((group, index) => (
          <div key={index} className={cn('expression-group', `group-${group.length}`)}>
            {group.map((type) => (
              <div
                key={type}
                onClick={() => {
                  update(type);
                  toggleOpen();
                }}
              >
                {SYMBOLS[type]}
              </div>
            ))}
          </div>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

export default OperatorDropdown;
