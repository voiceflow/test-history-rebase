import * as Platform from '@voiceflow/platform-config';
import { ContextMenu, Divider, Table, TableTypes } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { useNLUItemMenu } from '@/contexts/NLUContext/hooks';
import { NLUManagerContext } from '@/pages/NLUManager/context';
import { isBuiltInIntent } from '@/utils/intent';

const Row: React.FC<TableTypes.ConfigurableRowProps<Platform.Base.Models.Intent.Model>> = ({ item, children, onMouseEnter, onMouseLeave }) => {
  const nluManager = React.useContext(NLUManagerContext);
  const isActiveItem = item.id === nluManager.activeItemID;

  const { options } = useNLUItemMenu({
    itemID: item.id,
    itemType: InteractionModelTabType.INTENTS,
    onRename: () => nluManager.setRenamingIntentID(item.id),
    isBuiltIn: isBuiltInIntent(item.id),
  });

  return (
    <ContextMenu options={options} selfDismiss>
      {({ isOpen, onContextMenu }) => (
        <>
          <Table.Row
            active={isOpen || isActiveItem}
            onClick={() => nluManager.toggleActiveItemID(item.id)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onContextMenu={onContextMenu}
          >
            {children}
          </Table.Row>
          <Divider offset={0} isSecondaryColor />
        </>
      )}
    </ContextMenu>
  );
};

export default Row;
