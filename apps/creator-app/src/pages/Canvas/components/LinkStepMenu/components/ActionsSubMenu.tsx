import { Box, isUIOnlyMenuItemOption, stopPropagation, usePersistFunction } from '@voiceflow/ui';
import React from 'react';
import { generatePath } from 'react-router-dom';

import { EngineContext } from '@/pages/Canvas/contexts';
import { useActionsOptions } from '@/pages/Canvas/hooks';
import { PATH as ACTIONS_PATH } from '@/pages/Canvas/managers/components/Actions/constants';

import SubMenu from './SubMenu';
import SubMenuItem from './SubMenuItem';

interface ActionsSubMenuProps {
  parentPath: string;
  parentParams: Record<string, string>;
  sourcePortID: string | null;
}

const ActionsSubMenu = React.forwardRef<HTMLDivElement, ActionsSubMenuProps>(
  ({ parentPath, parentParams, sourcePortID }, ref) => {
    const engine = React.useContext(EngineContext)!;

    const goToActions = usePersistFunction(
      ({
        sourcePortID,
        sourceNodeID,
        actionNodeID,
      }: {
        sourcePortID: string;
        sourceNodeID: string;
        actionNodeID: string;
      }) => {
        engine.setActive(sourceNodeID, {
          nodeSubPath: generatePath(parentPath ? `${parentPath}/${ACTIONS_PATH}` : ACTIONS_PATH, {
            ...parentParams,
            sourcePortID,
            actionNodeID,
          }),
        });
      }
    );

    const { options } = useActionsOptions({ goToActions, sourcePortID });

    return (
      <SubMenu ref={ref}>
        {options.map(
          (item, index) =>
            item &&
            (isUIOnlyMenuItemOption(item) ? (
              <Box key={index} my={7.5} height={1} backgroundColor="#EAEFF4" />
            ) : (
              <SubMenuItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                onClick={stopPropagation(item.onClick)}
                iconProps={{ color: '#132144' }}
              />
            ))
        )}
      </SubMenu>
    );
  }
);

export default ActionsSubMenu;
