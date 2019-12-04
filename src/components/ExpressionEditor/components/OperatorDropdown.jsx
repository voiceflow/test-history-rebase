import cn from 'classnames';
import React from 'react';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';

import { ExpressionType } from '@/constants';
import { useToggle } from '@/hooks/toggle';

import { GROUPS, MAX_DEPTH } from '../constants';
import ExpressionOperator from './ExpressionOperator';

const MAX_DEPTH_GROUPS = [[ExpressionType.VALUE, ExpressionType.VARIABLE], [ExpressionType.ADVANCE]];

function OperatorDropdown({ depth, children, update, className }) {
  const [open, toggleOpen] = useToggle(false);

  const createOnClick = (type) => () => {
    update(type);
    toggleOpen();
  };

  const menuGroups = depth === MAX_DEPTH ? MAX_DEPTH_GROUPS : GROUPS;

  return (
    <Dropdown isOpen={open} toggle={toggleOpen}>
      <DropdownToggle tag="div" className={className}>
        {children}
      </DropdownToggle>

      <DropdownMenu className="expression-menu">
        {menuGroups.map((group, index) => (
          <div key={index} className={cn('expression-group', `group-${group.length}`)}>
            {group.map((type) => (
              <div key={type} role="button" onClick={createOnClick(type)} tabIndex="0">
                <ExpressionOperator type={type} />
              </div>
            ))}
          </div>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

export default React.memo(OperatorDropdown);
