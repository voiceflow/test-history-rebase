import React from 'react';
import { Manager, Popper, Reference } from 'react-popper';

import Portal from '@/components/Portal';
import { ExpressionType } from '@/constants';
import { useDismissable } from '@/hooks/dismiss';
import { swallowEvent } from '@/utils/dom';

import { GROUPS, MAX_DEPTH } from '../constants';
import ExpressionGroup from './ExpressionGroup';
import ExpressionMenu from './ExpressionMenu';
import ExpressionMenuItem from './ExpressionMenuItem';
import ExpressionMenuToggle from './ExpressionMenuToggle';
import ExpressionOperator from './ExpressionOperator';

const MAX_DEPTH_GROUPS = [[ExpressionType.VALUE, ExpressionType.VARIABLE], [ExpressionType.ADVANCE]];

function OperatorDropdown({ depth, children, update, className }) {
  const [open, toggleOpen] = useDismissable(false);

  const createOnClick = (type) => () => {
    update(type);
    toggleOpen();
  };

  const menuGroups = depth === MAX_DEPTH ? MAX_DEPTH_GROUPS : GROUPS;

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <ExpressionMenuToggle ref={ref} isOpened={open} onClick={swallowEvent(toggleOpen)} className={className}>
            {children}
          </ExpressionMenuToggle>
        )}
      </Reference>

      {open && (
        <Portal portalNode={document.body}>
          <Popper placement="bottom-end" modifiers={{ offset: { offset: '0,5' }, preventOverflow: { boundariesElement: document.body } }}>
            {({ ref, style }) => (
              <ExpressionMenu ref={ref} style={style}>
                {menuGroups.map((group, index) => (
                  <ExpressionGroup key={index} size={group.length}>
                    {group.map((type) => (
                      <ExpressionMenuItem key={type} onClick={createOnClick(type)}>
                        <ExpressionOperator type={type} />
                      </ExpressionMenuItem>
                    ))}
                  </ExpressionGroup>
                ))}
              </ExpressionMenu>
            )}
          </Popper>
        </Portal>
      )}
    </Manager>
  );
}

export default React.memo(OperatorDropdown);
